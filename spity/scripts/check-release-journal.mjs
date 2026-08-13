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
  { code: 'private-ip', pattern: /\b(?:10\.(?:\d{1,3}\.){2}\d{1,3}|192\.168\.(?:\d{1,3}\.)\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3})\b/ },
  { code: 'email-address', pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i },
]

const issue = (code, path, message, recordId) => ({ code, path, message, ...(recordId ? { recordId } : {}) })
const hasText = (value) => typeof value === 'string' && value.trim().length > 0
const isDate = (value) => typeof value === 'string' && !Number.isNaN(new Date(value).valueOf())
const isVersion = (value) => typeof value === 'string' && /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(value)
const isRevision = (value) => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value)

const scanSensitiveValue = (value, path = '$', findings = []) => {
  if (typeof value === 'string') {
    for (const rule of sensitivePatterns) {
      if (rule.pattern.test(value)) {
        findings.push(issue('sensitive-data', path, `Contenu interdit détecté (${rule.code}).`))
      }
    }
  } else if (Array.isArray(value)) {
    value.forEach((entry, index) => scanSensitiveValue(entry, `${path}[${index}]`, findings))
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, entry]) => scanSensitiveValue(entry, `${path}.${key}`, findings))
  }
  return findings
}

const requireText = (value, path, errors, recordId) => {
  if (!hasText(value)) {
    errors.push(issue('required-text', path, 'Un texte non vide est requis.', recordId))
  }
}

const requireDate = (value, path, errors, recordId) => {
  if (!isDate(value)) {
    errors.push(issue('invalid-date', path, 'Une date ISO 8601 valide est requise.', recordId))
  }
}

const validateReference = async (reference, path, errors, root, recordId) => {
  if (!reference || typeof reference !== 'object') {
    errors.push(issue('invalid-reference', path, 'Une référence structurée est requise.', recordId))
    return
  }

  if (reference.kind === 'url') {
    try {
      const target = new URL(reference.value)
      if (target.protocol !== 'https:') {
        errors.push(issue('invalid-reference-url', path, 'Une URL de preuve doit utiliser HTTPS.', recordId))
      }
    } catch {
      errors.push(issue('invalid-reference-url', path, 'Une URL de preuve valide est requise.', recordId))
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

const validateReferences = async (references, path, errors, root, recordId, missingCode) => {
  if (!Array.isArray(references) || references.length === 0) {
    errors.push(issue(missingCode, path, 'Au moins une référence est requise.', recordId))
    return
  }
  await Promise.all(references.map((reference, index) => validateReference(reference, `${path}[${index}]`, errors, root, recordId)))
}

const validateChanges = async (record, errors, root, recordId) => {
  const changes = record.changes
  if (!changes || typeof changes !== 'object') {
    errors.push(issue('missing-changes', '$.changes', 'Les évolutions de la version sont requises.', recordId))
    return
  }

  const features = changes.features
  const corrections = changes.corrections
  if (!Array.isArray(features) || !Array.isArray(corrections)) {
    errors.push(issue('invalid-changes', '$.changes', 'Les fonctionnalités et les correctifs doivent être des listes.', recordId))
    return
  }
  if (features.length + corrections.length === 0) {
    errors.push(issue('empty-changes', '$.changes', 'Au moins une évolution ou un correctif est requis.', recordId))
  }
  features.forEach((feature, index) => requireText(feature, `$.changes.features[${index}]`, errors, recordId))

  for (const [index, correction] of corrections.entries()) {
    const path = `$.changes.corrections[${index}]`
    if (!correction || typeof correction !== 'object') {
      errors.push(issue('invalid-correction', path, 'Un correctif structuré est requis.', recordId))
      continue
    }
    ;['id', 'type', 'summary'].forEach((key) => requireText(correction[key], `${path}.${key}`, errors, recordId))
    await validateReferences(correction.documentation, `${path}.documentation`, errors, root, recordId, 'missing-correction-documentation')
  }
}

const validateHistory = (record, policy, errors, recordId) => {
  if (!Array.isArray(record.history) || record.history.length === 0) {
    errors.push(issue('missing-history', '$.history', 'Un historique attribué est requis.', recordId))
    return
  }

  let previousDate = null
  record.history.forEach((entry, index) => {
    const path = `$.history[${index}]`
    if (!entry || typeof entry !== 'object') {
      errors.push(issue('invalid-history-entry', path, 'Une décision d’historique structurée est requise.', recordId))
      return
    }
    requireDate(entry.at, `${path}.at`, errors, recordId)
    requireText(entry.actorRole, `${path}.actorRole`, errors, recordId)
    requireText(entry.reason, `${path}.reason`, errors, recordId)
    if (!policy.statuses.includes(entry.to)) {
      errors.push(issue('invalid-history-status', `${path}.to`, 'Le statut d’historique n’est pas autorisé.', recordId))
    }
    const currentDate = isDate(entry.at) ? new Date(entry.at) : null
    if (previousDate && currentDate && currentDate < previousDate) {
      errors.push(issue('non-chronological-history', `${path}.at`, 'L’historique doit être chronologique.', recordId))
    }
    previousDate = currentDate ?? previousDate
  })

  if (record.history.at(-1)?.to !== record.status) {
    errors.push(issue('status-history-mismatch', '$.status', 'Le statut courant doit correspondre à la dernière décision.', recordId))
  }
}

const validateDeployment = (record, policy, errors, recordId) => {
  if (record.status !== 'observed-production') {
    if (record.deployment?.environment === 'production') {
      errors.push(issue('undeployed-record-has-production-proof', '$.deployment', 'Seule une version observée peut porter une preuve de production.', recordId))
    }
    return
  }

  const deployment = record.deployment
  if (!deployment || typeof deployment !== 'object') {
    errors.push(issue('missing-deployment', '$.deployment', 'Une observation de déploiement est requise.', recordId))
    return
  }
  if (deployment.environment !== 'production' || !policy.environments.includes(deployment.environment)) {
    errors.push(issue('invalid-deployment-environment', '$.deployment.environment', 'Une version déployée doit être observée en production.', recordId))
  }
  requireDate(deployment.observedAt, '$.deployment.observedAt', errors, recordId)
  const health = deployment.health
  if (!health || typeof health !== 'object') {
    errors.push(issue('missing-health-proof', '$.deployment.health', 'La preuve de santé est requise.', recordId))
    return
  }
  if (health.status !== 'ok') {
    errors.push(issue('invalid-health-status', '$.deployment.health.status', 'La santé observée doit être ok.', recordId))
  }
  if (health.version !== record.identity?.version) {
    errors.push(issue('health-version-mismatch', '$.deployment.health.version', 'La version de santé doit correspondre à l’identité de la fiche.', recordId))
  }
  if (health.revision !== record.identity?.revision) {
    errors.push(issue('health-revision-mismatch', '$.deployment.health.revision', 'La révision de santé doit correspondre à l’identité de la fiche.', recordId))
  }
  try {
    const source = new URL(health.source)
    if (source.protocol !== 'https:') {
      errors.push(issue('invalid-health-source', '$.deployment.health.source', 'La source de santé doit utiliser HTTPS.', recordId))
    }
  } catch {
    errors.push(issue('invalid-health-source', '$.deployment.health.source', 'La source de santé doit être une URL HTTPS valide.', recordId))
  }
}

export const validateReleaseRecord = async ({ policy, record, root = repositoryRoot }) => {
  const errors = []
  const recordId = record?.id
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return [issue('invalid-record', '$', 'Une fiche de journal JSON est requise.')]
  }
  if (record.schemaVersion !== policy.schemaVersion) {
    errors.push(issue('invalid-schema-version', '$.schemaVersion', `schemaVersion ${policy.schemaVersion} est requis.`, recordId))
  }
  if (!hasText(record.id) || !(new RegExp(policy.identifier.pattern)).test(record.id)) {
    errors.push(issue('invalid-id', '$.id', 'L’identifiant stable ne respecte pas la politique.', recordId))
  }
  if (!policy.statuses.includes(record.status)) {
    errors.push(issue('invalid-status', '$.status', 'Le statut n’est pas autorisé.', recordId))
  }
  requireText(record.title, '$.title', errors, recordId)

  const identity = record.identity
  if (!identity || typeof identity !== 'object') {
    errors.push(issue('missing-identity', '$.identity', 'L’identité version/révision est requise.', recordId))
  } else {
    if (!isVersion(identity.version)) {
      errors.push(issue('invalid-version', '$.identity.version', 'La version doit respecter SemVer.', recordId))
    }
    if (!isRevision(identity.revision)) {
      errors.push(issue('invalid-revision', '$.identity.revision', 'La révision doit être un SHA Git complet.', recordId))
    }
    if (record.status === 'published' && (!hasText(identity.tag) || identity.tag !== `v${identity.version}`)) {
      errors.push(issue('published-tag-mismatch', '$.identity.tag', 'Une release publiée exige un tag vSemVer identique à la version.', recordId))
    }
  }

  if (record.status === 'published') {
    requireDate(record.publishedAt, '$.publishedAt', errors, recordId)
  }
  if (record.status === 'candidate') {
    requireDate(record.candidateAt, '$.candidateAt', errors, recordId)
    requireText(record.candidateVerification?.ciRun, '$.candidateVerification.ciRun', errors, recordId)
    requireText(record.candidateVerification?.exclusionReason, '$.candidateVerification.exclusionReason', errors, recordId)
  }

  await validateChanges(record, errors, root, recordId)
  await validateReferences(record.documentation, '$.documentation', errors, root, recordId, 'missing-documentation')
  requireText(record.rollback, '$.rollback', errors, recordId)
  validateHistory(record, policy, errors, recordId)
  validateDeployment(record, policy, errors, recordId)
  await validateReferences(record.evidence, '$.evidence', errors, root, recordId, 'missing-evidence')
  scanSensitiveValue(record).forEach((entry) => errors.push({ ...entry, recordId }))
  return errors
}

export const loadReleaseJournalPolicy = async (policyPath = process.env.RELEASE_JOURNAL_POLICY_PATH ?? resolve(applicationRoot, 'release-journal-policy.json')) => {
  return JSON.parse(await readFile(policyPath, 'utf8'))
}

export const loadReleaseJournalRecords = async (directory = process.env.RELEASE_JOURNAL_DIRECTORY ?? resolve(applicationRoot, 'release-journal')) => {
  const files = (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => resolve(directory, entry.name))
    .sort((left, right) => left.localeCompare(right, 'fr'))
  const records = []
  const errors = []
  for (const file of files) {
    try {
      records.push({ file, record: JSON.parse(await readFile(file, 'utf8')) })
    } catch (error) {
      errors.push(issue('invalid-json', relative(repositoryRoot, file), `JSON invalide : ${error.message}`))
    }
  }
  return { records, errors }
}

export const auditReleaseJournal = async ({ policy, records, root = repositoryRoot, expectedReleaseVersion = null }) => {
  const errors = []
  const identifiers = new Set()
  const observedIdentities = new Set()
  const statusCounts = Object.fromEntries(policy.statuses.map((status) => [status, 0]))

  for (const record of records) {
    if (record && typeof record === 'object' && record.status in statusCounts) {
      statusCounts[record.status] += 1
    }
    errors.push(...await validateReleaseRecord({ policy, record, root }))
    if (hasText(record?.id)) {
      if (identifiers.has(record.id)) {
        errors.push(issue('duplicate-id', '$.id', `Identifiant dupliqué : ${record.id}`, record.id))
      }
      identifiers.add(record.id)
    }
    if (policy.deployedStatuses.includes(record?.status)) {
      const identity = `${record?.identity?.version}@${record?.identity?.revision}`
      if (observedIdentities.has(identity)) {
        errors.push(issue('duplicate-observed-identity', '$.identity', `Version/révision de production dupliquée : ${identity}`, record.id))
      }
      observedIdentities.add(identity)
    }
  }

  const deployedRecords = records.filter((record) => policy.deployedStatuses.includes(record?.status))
  if (deployedRecords.length === 0) {
    errors.push(issue('missing-deployed-version', '$', 'Le journal doit contenir au moins une version effectivement observée en production.'))
  }
  if (expectedReleaseVersion && !records.some((record) => record?.identity?.version === expectedReleaseVersion && ['candidate', 'published'].includes(record.status))) {
    errors.push(issue('missing-release-entry', '$', `La release ${expectedReleaseVersion} doit posséder une fiche candidate ou publiée dans le journal.`))
  }

  return {
    schemaVersion: 1,
    checkedAt: new Date().toISOString(),
    compliant: errors.length === 0,
    recordCount: records.length,
    deployedRecordCount: deployedRecords.length,
    statusCounts,
    errors,
    records: records.map((record) => ({
      id: record?.id ?? null,
      status: record?.status ?? null,
      version: record?.identity?.version ?? null,
      revision: record?.identity?.revision ?? null,
      correctionCount: Array.isArray(record?.changes?.corrections) ? record.changes.corrections.length : 0,
    })).sort((left, right) => (left.id ?? '').localeCompare(right.id ?? '', 'fr')),
  }
}

export const writeReleaseJournalReport = async (outputPath, report) => {
  const absolutePath = resolve(outputPath)
  await mkdir(dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  return absolutePath
}

const isMainModule = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMainModule) {
  const policy = await loadReleaseJournalPolicy()
  const loaded = await loadReleaseJournalRecords()
  const report = await auditReleaseJournal({
    policy,
    records: loaded.records.map(({ record }) => record),
    expectedReleaseVersion: process.env.RELEASE_JOURNAL_EXPECTED_VERSION ?? null,
  })
  report.errors.unshift(...loaded.errors)
  report.compliant = report.errors.length === 0
  if (process.env.RELEASE_JOURNAL_REPORT_PATH) {
    await writeReleaseJournalReport(process.env.RELEASE_JOURNAL_REPORT_PATH, report)
  }
  console.info(JSON.stringify(report, null, 2))
  if (!report.compliant) {
    process.exitCode = 1
  }
}
