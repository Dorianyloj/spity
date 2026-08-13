import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { dirname, isAbsolute, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const applicationRoot = resolve(scriptDirectory, '..')
const repositoryRoot = resolve(applicationRoot, '..')

const sensitivePatterns = [
  { code: 'private-key', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/i },
  { code: 'bearer-token', pattern: /\bBearer\s+[A-Za-z0-9._-]{8,}/i },
  { code: 'credential-assignment', pattern: /\b(?:password|passphrase|secret|token|api[_-]?key|authorization)\b\s*[:=]\s*(?!redacted\b)\S+/i },
  { code: 'private-ip', pattern: /\b(?:10\.(?:\d{1,3}\.){2}\d{1,3}|192\.168\.(?:\d{1,3}\.)\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/ },
  { code: 'email-address', pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i },
]

const issue = (code, path, message, recordId) => ({ code, path, message, ...(recordId ? { recordId } : {}) })
const hasText = (value) => typeof value === 'string' && value.trim().length > 0
const asDate = (value) => {
  const date = new Date(value)
  return typeof value === 'string' && !Number.isNaN(date.valueOf()) ? date : null
}
const requireText = (value, path, errors, recordId) => {
  if (!hasText(value)) errors.push(issue('required-text', path, 'Un texte non vide est requis.', recordId))
}
const requireDate = (value, path, errors, recordId) => {
  if (!asDate(value)) errors.push(issue('invalid-date', path, 'Une date ISO 8601 valide est requise.', recordId))
}

const scanSensitiveValue = (value, path = '$', findings = []) => {
  if (typeof value === 'string') {
    for (const rule of sensitivePatterns) {
      if (rule.pattern.test(value)) findings.push(issue('sensitive-data', path, `Contenu interdit détecté (${rule.code}).`))
    }
  } else if (Array.isArray(value)) {
    value.forEach((entry, index) => scanSensitiveValue(entry, `${path}[${index}]`, findings))
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, entry]) => scanSensitiveValue(entry, `${path}.${key}`, findings))
  }
  return findings
}

const validateReference = async (reference, path, errors, root, recordId) => {
  if (!reference || typeof reference !== 'object') {
    errors.push(issue('invalid-reference', path, 'Une référence structurée est requise.', recordId))
    return
  }
  if (reference.kind === 'url') {
    try {
      if (new URL(reference.value).protocol !== 'https:') throw new Error('protocol')
    } catch {
      errors.push(issue('invalid-reference-url', path, 'Une URL de preuve HTTPS valide est requise.', recordId))
    }
    return
  }
  if (reference.kind !== 'repository-path' || !hasText(reference.value)) {
    errors.push(issue('invalid-reference-kind', path, 'La référence doit être un chemin du dépôt ou une URL HTTPS.', recordId))
    return
  }
  const rootPath = resolve(root)
  const absolutePath = resolve(rootPath, reference.value)
  const pathFromRoot = relative(rootPath, absolutePath)
  if (pathFromRoot === '..' || pathFromRoot.startsWith('../') || pathFromRoot.startsWith('..\\') || isAbsolute(pathFromRoot)) {
    errors.push(issue('reference-outside-repository', path, 'La référence doit rester dans le dépôt.', recordId))
    return
  }
  try {
    await access(absolutePath, constants.R_OK)
  } catch {
    errors.push(issue('reference-not-found', path, `Référence introuvable : ${reference.value}`, recordId))
  }
}

const validateReferences = async (references, path, errors, root, recordId, missingCode = 'missing-evidence') => {
  if (!Array.isArray(references) || references.length === 0) {
    errors.push(issue(missingCode, path, 'Au moins une référence est requise.', recordId))
    return
  }
  await Promise.all(references.map((reference, index) => validateReference(reference, `${path}[${index}]`, errors, root, recordId)))
}

const validateHistory = (record, policy, errors, recordId) => {
  if (!Array.isArray(record.history) || record.history.length === 0) {
    errors.push(issue('missing-history', '$.history', 'Un historique de décision est requis.', recordId))
    return
  }
  let current = 'initial'
  let previousAt = null
  record.history.forEach((entry, index) => {
    const path = `$.history[${index}]`
    if (!entry || typeof entry !== 'object') {
      errors.push(issue('invalid-history-entry', path, 'Une transition structurée est requise.', recordId))
      return
    }
    if (entry.from !== (current === 'initial' ? null : current)) {
      errors.push(issue('invalid-transition-origin', `${path}.from`, 'La transition ne part pas de l’état courant.', recordId))
    }
    if (!(policy.transitions[current] ?? []).includes(entry.to)) {
      errors.push(issue('invalid-transition', `${path}.to`, 'Cette transition n’est pas autorisée.', recordId))
    }
    const date = asDate(entry.at)
    if (!date) errors.push(issue('invalid-date', `${path}.at`, 'Une date ISO 8601 valide est requise.', recordId))
    else if (previousAt && date < previousAt) errors.push(issue('non-chronological-history', `${path}.at`, 'L’historique doit être chronologique.', recordId))
    if (!policy.roles.includes(entry.actorRole)) errors.push(issue('invalid-history-role', `${path}.actorRole`, 'Le rôle n’est pas autorisé.', recordId))
    requireText(entry.reason, `${path}.reason`, errors, recordId)
    current = entry.to
    previousAt = date ?? previousAt
  })
  if (record.history.at(-1)?.to !== record.status) {
    errors.push(issue('status-history-mismatch', '$.status', 'Le statut doit correspondre à la dernière transition.', recordId))
  }
}

const validateHandoffs = (record, policy, errors, recordId) => {
  if (!Array.isArray(record.handoffs) || record.handoffs.length < 2) {
    errors.push(issue('missing-handoffs', '$.handoffs', 'Les transmissions support/technique sont requises.', recordId))
    return
  }
  let previousAt = null
  let supportToMaintainer = false
  let maintainerToSupport = false
  record.handoffs.forEach((entry, index) => {
    const path = `$.handoffs[${index}]`
    const date = asDate(entry?.at)
    if (!date) errors.push(issue('invalid-date', `${path}.at`, 'Une date ISO 8601 valide est requise.', recordId))
    else if (previousAt && date < previousAt) errors.push(issue('non-chronological-handoffs', `${path}.at`, 'Les transmissions doivent être chronologiques.', recordId))
    if (!policy.roles.includes(entry?.fromRole) || !policy.roles.includes(entry?.toRole) || entry?.fromRole === entry?.toRole) {
      errors.push(issue('invalid-handoff-role', path, 'Chaque transmission doit relier deux rôles autorisés distincts.', recordId))
    }
    requireText(entry?.kind, `${path}.kind`, errors, recordId)
    requireText(entry?.summary, `${path}.summary`, errors, recordId)
    supportToMaintainer ||= entry?.fromRole === 'support-l1' && entry?.toRole === 'maintainer-l2'
    maintainerToSupport ||= entry?.fromRole === 'maintainer-l2' && entry?.toRole === 'support-l1'
    previousAt = date ?? previousAt
  })
  if (!supportToMaintainer) errors.push(issue('missing-support-escalation', '$.handoffs', 'Le support doit transmettre une qualification au mainteneur.', recordId))
  if (!maintainerToSupport) errors.push(issue('missing-technical-feedback', '$.handoffs', 'Le mainteneur doit transmettre son expertise au support.', recordId))
}

export const validateSupportCollaborationRecord = async ({ policy, record, root = repositoryRoot }) => {
  const errors = []
  const recordId = record?.id
  if (!record || typeof record !== 'object' || Array.isArray(record)) return [issue('invalid-record', '$', 'Une fiche de collaboration JSON est requise.')]
  if (record.schemaVersion !== policy.schemaVersion) errors.push(issue('invalid-schema-version', '$.schemaVersion', `schemaVersion ${policy.schemaVersion} est requis.`, recordId))
  if (!hasText(record.id) || !(new RegExp(policy.identifier.pattern)).test(record.id)) errors.push(issue('invalid-id', '$.id', 'L’identifiant stable ne respecte pas la politique.', recordId))
  if (!policy.statuses.includes(record.status)) errors.push(issue('invalid-status', '$.status', 'Le statut n’est pas autorisé.', recordId))
  requireText(record.title, '$.title', errors, recordId)

  if (!record.simulation || !policy.simulationModes.includes(record.simulation.mode)) {
    errors.push(issue('invalid-simulation-mode', '$.simulation.mode', 'La nature contrôlée de la simulation doit être déclarée.', recordId))
  }
  requireText(record.simulation?.disclosure, '$.simulation.disclosure', errors, recordId)
  if (!/fictiv|simul/i.test(record.simulation?.disclosure ?? '')) errors.push(issue('missing-simulation-disclosure', '$.simulation.disclosure', 'La divulgation doit indiquer explicitement la simulation.', recordId))
  requireText(record.simulation?.factualBasis, '$.simulation.factualBasis', errors, recordId)

  requireDate(record.context?.reportedAt, '$.context.reportedAt', errors, recordId)
  for (const key of ['productArea', 'observed', 'expected', 'impact', 'priority']) requireText(record.context?.[key], `$.context.${key}`, errors, recordId)
  if (record.context?.contact?.identity !== 'not-collected') errors.push(issue('contact-identity-not-minimized', '$.context.contact.identity', 'La fiche doit minimiser l’identité du contact.', recordId))
  requireText(record.context?.contact?.channel, '$.context.contact.channel', errors, recordId)

  if (!/^SPITY-INC-\d{4}-\d{4}$/.test(record.linkedIncident?.id ?? '')) errors.push(issue('invalid-linked-incident', '$.linkedIncident.id', 'Une anomalie source stable est requise.', recordId))
  if (record.linkedIncident?.recordPath !== `spity/incidents/${record.linkedIncident?.id}.json`) errors.push(issue('linked-incident-path-mismatch', '$.linkedIncident.recordPath', 'Le chemin doit correspondre à l’identifiant de l’anomalie.', recordId))
  await validateReference({ kind: 'repository-path', value: record.linkedIncident?.recordPath }, '$.linkedIncident.recordPath', errors, root, recordId)

  const support = record.supportContribution
  if (!support || typeof support !== 'object') errors.push(issue('missing-support-contribution', '$.supportContribution', 'La contribution support est requise.', recordId))
  else {
    requireText(support.anonymization, '$.supportContribution.anonymization', errors, recordId)
    if (!Array.isArray(support.reproduction) || support.reproduction.length === 0 || !support.reproduction.every(hasText)) errors.push(issue('missing-support-reproduction', '$.supportContribution.reproduction', 'La reproduction support doit être décrite.', recordId))
    if (!Array.isArray(support.functionalAcceptanceCriteria) || support.functionalAcceptanceCriteria.length === 0 || !support.functionalAcceptanceCriteria.every(hasText)) errors.push(issue('missing-acceptance-criteria', '$.supportContribution.functionalAcceptanceCriteria', 'Des critères d’acceptation fonctionnels sont requis.', recordId))
    requireText(support.proposedUserResponse, '$.supportContribution.proposedUserResponse', errors, recordId)
  }

  const maintainer = record.maintainerContribution
  if (!maintainer || typeof maintainer !== 'object') errors.push(issue('missing-maintainer-contribution', '$.maintainerContribution', 'La contribution du mainteneur est requise.', recordId))
  else {
    for (const key of ['triage', 'rootCause', 'resolution']) requireText(maintainer[key], `$.maintainerContribution.${key}`, errors, recordId)
    if (!Array.isArray(maintainer.technicalValidation) || maintainer.technicalValidation.length === 0 || !maintainer.technicalValidation.every(hasText)) errors.push(issue('missing-technical-validation', '$.maintainerContribution.technicalValidation', 'Les validations techniques sont requises.', recordId))
  }

  const resolution = record.resolution
  if (!resolution || typeof resolution !== 'object') errors.push(issue('missing-resolution', '$.resolution', 'La résolution est requise.', recordId))
  else {
    if (!policy.deploymentStatuses.includes(resolution.deploymentStatus)) errors.push(issue('invalid-deployment-status', '$.resolution.deploymentStatus', 'Le statut de déploiement n’est pas autorisé.', recordId))
    requireText(resolution.statement, '$.resolution.statement', errors, recordId)
    requireText(resolution.technicalResult, '$.resolution.technicalResult', errors, recordId)
    if (resolution.deploymentStatus === 'ci-validated-not-deployed' && !/aucune observation|pas.*déploiement|non.*déploy/i.test(resolution.statement)) errors.push(issue('missing-deployment-disclosure', '$.resolution.statement', 'Une fiche CI seule doit exclure explicitement la preuve de production.', recordId))
    if (record.status === 'closed') {
      if (resolution.supportValidation?.status !== 'passed') errors.push(issue('missing-support-validation', '$.resolution.supportValidation.status', 'Une clôture exige une validation support réussie.', recordId))
      if (resolution.supportValidation?.mode !== 'simulated') errors.push(issue('invalid-support-validation-mode', '$.resolution.supportValidation.mode', 'La validation doit conserver le caractère simulé du scénario.', recordId))
      requireText(resolution.supportValidation?.result, '$.resolution.supportValidation.result', errors, recordId)
    }
  }

  validateHandoffs(record, policy, errors, recordId)
  validateHistory(record, policy, errors, recordId)
  await validateReferences(record.evidence, '$.evidence', errors, root, recordId)
  if (record.sensitiveDataReview?.status !== 'passed') errors.push(issue('sensitive-data-review', '$.sensitiveDataReview.status', 'La revue des données sensibles doit être validée.', recordId))
  requireDate(record.sensitiveDataReview?.reviewedAt, '$.sensitiveDataReview.reviewedAt', errors, recordId)
  requireText(record.sensitiveDataReview?.reviewedByRole, '$.sensitiveDataReview.reviewedByRole', errors, recordId)
  requireText(record.sensitiveDataReview?.statement, '$.sensitiveDataReview.statement', errors, recordId)
  scanSensitiveValue(record).forEach((entry) => errors.push({ ...entry, recordId }))
  return errors
}

export const loadSupportCollaborationPolicy = async (policyPath = process.env.SUPPORT_COLLABORATION_POLICY_PATH ?? resolve(applicationRoot, 'support-collaboration-policy.json')) => JSON.parse(await readFile(policyPath, 'utf8'))

export const loadSupportCollaborationRecords = async (directory = process.env.SUPPORT_COLLABORATION_DIRECTORY ?? resolve(applicationRoot, 'support-collaborations')) => {
  const files = (await readdir(directory, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith('.json')).map((entry) => resolve(directory, entry.name)).sort((a, b) => a.localeCompare(b, 'fr'))
  const records = []
  const errors = []
  for (const file of files) {
    try { records.push({ file, record: JSON.parse(await readFile(file, 'utf8')) }) }
    catch (error) { errors.push(issue('invalid-json', relative(repositoryRoot, file), `JSON invalide : ${error.message}`)) }
  }
  return { records, errors }
}

export const auditSupportCollaborations = async ({ policy, records, root = repositoryRoot } = {}) => {
  const resolvedPolicy = policy ?? await loadSupportCollaborationPolicy()
  const sourceRecords = records ?? (await loadSupportCollaborationRecords()).records.map(({ record }) => record)
  const errors = []
  const identifiers = new Set()
  const statusCounts = Object.fromEntries(resolvedPolicy.statuses.map((status) => [status, 0]))
  for (const record of sourceRecords) {
    if (record?.status in statusCounts) statusCounts[record.status] += 1
    errors.push(...await validateSupportCollaborationRecord({ policy: resolvedPolicy, record, root }))
    if (hasText(record?.id) && identifiers.has(record.id)) errors.push(issue('duplicate-id', '$.id', `Identifiant dupliqué : ${record.id}`, record.id))
    identifiers.add(record?.id)
  }
  if (sourceRecords.length === 0) errors.push(issue('missing-collaboration-record', '$', 'Au moins une collaboration support est requise.'))
  return {
    schemaVersion: 1,
    checkedAt: new Date().toISOString(),
    compliant: errors.length === 0,
    recordCount: sourceRecords.length,
    closedRecordCount: sourceRecords.filter((record) => record?.status === 'closed').length,
    statusCounts,
    errors,
    records: sourceRecords.map((record) => ({ id: record?.id ?? null, status: record?.status ?? null, incidentId: record?.linkedIncident?.id ?? null, deploymentStatus: record?.resolution?.deploymentStatus ?? null })).sort((a, b) => (a.id ?? '').localeCompare(b.id ?? '', 'fr')),
  }
}

export const writeSupportCollaborationReport = async (outputPath, report) => {
  const absolutePath = resolve(outputPath)
  await mkdir(dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  return absolutePath
}

const isMainModule = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMainModule) {
  const policy = await loadSupportCollaborationPolicy()
  const loaded = await loadSupportCollaborationRecords()
  const report = await auditSupportCollaborations({ policy, records: loaded.records.map(({ record }) => record) })
  report.errors.unshift(...loaded.errors)
  report.compliant = report.errors.length === 0
  if (process.env.SUPPORT_COLLABORATION_REPORT_PATH) await writeSupportCollaborationReport(process.env.SUPPORT_COLLABORATION_REPORT_PATH, report)
  console.info(JSON.stringify(report, null, 2))
  if (!report.compliant) process.exitCode = 1
}
