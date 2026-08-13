import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { basename, dirname, relative, resolve } from 'node:path'
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

const issue = (code, path, message) => ({ code, path, message })

const asDate = (value) => {
  const date = new Date(value)

  return typeof value === 'string' && !Number.isNaN(date.valueOf()) ? date : null
}

const hasText = (value) => typeof value === 'string' && value.trim().length > 0

const scanSensitiveValue = (value, path = '$', findings = []) => {
  if (typeof value === 'string') {
    for (const rule of sensitivePatterns) {
      if (rule.pattern.test(value)) {
        findings.push(issue('sensitive-data', path, `Contenu interdit détecté (${rule.code}).`))
      }
    }
    return findings
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => scanSensitiveValue(item, `${path}[${index}]`, findings))
    return findings
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => scanSensitiveValue(item, `${path}.${key}`, findings))
  }

  return findings
}

const validateDate = (value, path, errors) => {
  if (!asDate(value)) {
    errors.push(issue('invalid-date', path, 'Une date ISO 8601 valide est requise.'))
  }
}

const validateRequiredText = (value, path, errors) => {
  if (!hasText(value)) {
    errors.push(issue('required-text', path, 'Un texte non vide est requis.'))
  }
}

const validateRepositoryReference = async (reference, errors, root) => {
  if (!reference || typeof reference !== 'object') {
    errors.push(issue('invalid-evidence', '$.evidence', 'Une preuve structurée est requise.'))
    return
  }

  if (reference.kind === 'url') {
    try {
      const target = new URL(reference.value)

      if (target.protocol !== 'https:') {
        errors.push(issue('invalid-evidence-url', '$.evidence', 'Une URL de preuve doit utiliser HTTPS.'))
      }
    } catch {
      errors.push(issue('invalid-evidence-url', '$.evidence', 'Une URL de preuve valide est requise.'))
    }
    return
  }

  if (reference.kind !== 'repository-path' || !hasText(reference.value)) {
    errors.push(issue('invalid-evidence-kind', '$.evidence', 'La preuve doit être une URL HTTPS ou un chemin du dépôt.'))
    return
  }

  const target = resolve(root, reference.value)
  const normalizedRelative = relative(root, target)

  if (normalizedRelative.startsWith('..') || normalizedRelative === '') {
    errors.push(issue('unsafe-evidence-path', '$.evidence', 'Le chemin de preuve doit rester dans le dépôt.'))
    return
  }

  try {
    await access(target, constants.R_OK)
  } catch {
    errors.push(issue('missing-evidence-path', '$.evidence', `La preuve est introuvable : ${reference.value}.`))
  }
}

const statusesRequiringInvestigation = new Set(['planned', 'resolving', 'validating', 'resolved', 'closed'])
const statusesRequiringDecision = new Set(['planned', 'resolving', 'validating', 'resolved', 'closed'])
const statusesRequiringVerification = new Set(['resolved', 'closed'])

export const validateIncidentRecord = async ({ policy, record, repositoryRoot: root = repositoryRoot }) => {
  const errors = []
  const identifierPattern = new RegExp(policy.identifierPattern)

  if (record?.schemaVersion !== policy.schemaVersion) {
    errors.push(issue('schema-version', '$.schemaVersion', `La version de schéma doit être ${policy.schemaVersion}.`))
  }

  if (!identifierPattern.test(record?.id ?? '')) {
    errors.push(issue('invalid-id', '$.id', 'L’identifiant doit suivre SPITY-INC-YYYY-NNNN.'))
  }

  validateRequiredText(record?.title, '$.title', errors)

  if (!policy.statuses.includes(record?.status)) {
    errors.push(issue('invalid-status', '$.status', 'Le statut n’appartient pas au cycle de vie autorisé.'))
  }

  if (!policy.severities.includes(record?.classification?.severity)) {
    errors.push(issue('invalid-severity', '$.classification.severity', 'Une sévérité S1 à S4 est requise.'))
  }

  if (!policy.priorities.includes(record?.classification?.priority)) {
    errors.push(issue('invalid-priority', '$.classification.priority', 'Une priorité P1 à P4 est requise.'))
  }

  validateRequiredText(record?.classification?.category, '$.classification.category', errors)
  validateRequiredText(record?.classification?.userImpact, '$.classification.userImpact', errors)
  validateDate(record?.detection?.detectedAt, '$.detection.detectedAt', errors)
  validateRequiredText(record?.detection?.source, '$.detection.source', errors)
  validateRequiredText(record?.detection?.environment, '$.detection.environment', errors)
  validateRequiredText(record?.ownership?.ownerRole, '$.ownership.ownerRole', errors)
  validateRequiredText(record?.reproduction?.frequency, '$.reproduction.frequency', errors)
  validateRequiredText(record?.reproduction?.observed, '$.reproduction.observed', errors)
  validateRequiredText(record?.reproduction?.expected, '$.reproduction.expected', errors)

  if (record?.reproduction?.reproducible !== true) {
    errors.push(issue('reproduction-required', '$.reproduction.reproducible', 'La reproductibilité doit être explicitement évaluée à true.'))
  }

  for (const field of ['prerequisites', 'steps']) {
    if (!Array.isArray(record?.reproduction?.[field]) || record.reproduction[field].length === 0 || !record.reproduction[field].every(hasText)) {
      errors.push(issue('reproduction-details', `$.reproduction.${field}`, 'Au moins une étape textuelle est requise.'))
    }
  }

  if (statusesRequiringInvestigation.has(record?.status)) {
    validateRequiredText(record?.investigation?.method, '$.investigation.method', errors)
    validateRequiredText(record?.investigation?.rootCause, '$.investigation.rootCause', errors)
    validateRequiredText(record?.investigation?.scope, '$.investigation.scope', errors)
  }

  if (statusesRequiringDecision.has(record?.status)) {
    validateRequiredText(record?.decision?.selected, '$.decision.selected', errors)
    validateRequiredText(record?.decision?.rationale, '$.decision.rationale', errors)
  }

  if (!Array.isArray(record?.correctiveActions) || record.correctiveActions.length === 0) {
    errors.push(issue('corrective-action-required', '$.correctiveActions', 'Au moins une action corrective ou préventive est requise.'))
  } else {
    record.correctiveActions.forEach((action, index) => {
      if (!/^ACT-\d{4}-\d{4}-\d{2}$/.test(action?.id ?? '')) {
        errors.push(issue('invalid-action-id', `$.correctiveActions[${index}].id`, 'L’action doit avoir un identifiant stable.'))
      }
      validateRequiredText(action?.type, `$.correctiveActions[${index}].type`, errors)
      validateRequiredText(action?.status, `$.correctiveActions[${index}].status`, errors)
      validateRequiredText(action?.description, `$.correctiveActions[${index}].description`, errors)
      validateRequiredText(action?.reference, `$.correctiveActions[${index}].reference`, errors)
    })
  }

  if (!Array.isArray(record?.history) || record.history.length === 0) {
    errors.push(issue('history-required', '$.history', 'Le cycle de vie doit contenir au moins une transition.'))
  } else {
    let currentStatus = 'initial'
    let previousDate

    record.history.forEach((transition, index) => {
      const transitionPath = `$.history[${index}]`
      const expectedFrom = currentStatus === 'initial' ? null : currentStatus
      const transitionDate = asDate(transition?.at)

      if (transition?.from !== expectedFrom) {
        errors.push(issue('invalid-transition-origin', `${transitionPath}.from`, `La transition doit partir de ${expectedFrom ?? 'null'}.`))
      }
      if (!(policy.transitions[currentStatus] ?? []).includes(transition?.to)) {
        errors.push(issue('invalid-transition', `${transitionPath}.to`, `La transition ${currentStatus} -> ${transition?.to} est interdite.`))
      }
      if (!transitionDate) {
        errors.push(issue('invalid-date', `${transitionPath}.at`, 'Une date ISO 8601 valide est requise.'))
      } else if (previousDate && transitionDate < previousDate) {
        errors.push(issue('unordered-history', `${transitionPath}.at`, 'Les transitions doivent être chronologiques.'))
      }
      validateRequiredText(transition?.actorRole, `${transitionPath}.actorRole`, errors)
      validateRequiredText(transition?.reason, `${transitionPath}.reason`, errors)
      currentStatus = transition?.to
      previousDate = transitionDate ?? previousDate
    })

    if (currentStatus !== record?.status) {
      errors.push(issue('status-history-mismatch', '$.status', 'Le statut courant doit correspondre à la dernière transition.'))
    }
  }

  if (statusesRequiringVerification.has(record?.status)) {
    validateRequiredText(record?.verification?.status, '$.verification.status', errors)
    validateRequiredText(record?.verification?.result, '$.verification.result', errors)
    if (!Array.isArray(record?.verification?.commands) || record.verification.commands.length === 0 || !record.verification.commands.every(hasText)) {
      errors.push(issue('verification-required', '$.verification.commands', 'Les commandes ou contrôles de validation sont requis.'))
    }
  }

  if (record?.status === 'closed') {
    validateDate(record?.closure?.closedAt, '$.closure.closedAt', errors)
    validateRequiredText(record?.closure?.closedByRole, '$.closure.closedByRole', errors)
    validateRequiredText(record?.closure?.outcome, '$.closure.outcome', errors)
  }

  if (!Array.isArray(record?.evidence) || record.evidence.length === 0) {
    errors.push(issue('evidence-required', '$.evidence', 'Au moins une preuve est requise.'))
  } else {
    await Promise.all(record.evidence.map((reference) => validateRepositoryReference(reference, errors, root)))
  }

  if (record?.sensitiveDataReview?.status !== 'passed') {
    errors.push(issue('sensitive-data-review', '$.sensitiveDataReview.status', 'La revue des données sensibles doit être passée.'))
  }
  validateDate(record?.sensitiveDataReview?.reviewedAt, '$.sensitiveDataReview.reviewedAt', errors)
  validateRequiredText(record?.sensitiveDataReview?.reviewedByRole, '$.sensitiveDataReview.reviewedByRole', errors)
  validateRequiredText(record?.sensitiveDataReview?.statement, '$.sensitiveDataReview.statement', errors)

  scanSensitiveValue(record, '$', errors)

  return errors
}

export const loadIncidentPolicy = async (policyPath = resolve(applicationRoot, 'incident-policy.json')) => {
  const policy = JSON.parse(await readFile(policyPath, 'utf8'))

  if (policy.schemaVersion !== 1 || !Array.isArray(policy.statuses) || !policy.transitions) {
    throw new Error(`Politique d’incident invalide : ${policyPath}`)
  }

  return policy
}

export const loadIncidentRecords = async (directory = resolve(applicationRoot, 'incidents')) => {
  const files = (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, 'fr'))
  const records = []
  const errors = []

  for (const file of files) {
    try {
      records.push({ file, record: JSON.parse(await readFile(resolve(directory, file), 'utf8')) })
    } catch (error) {
      errors.push(issue('invalid-json', file, error instanceof Error ? error.message : String(error)))
    }
  }

  return { errors, records }
}

export const auditIncidentRegistry = async ({
  directory = resolve(applicationRoot, 'incidents'),
  policy,
  records,
  repositoryRoot: root = repositoryRoot,
} = {}) => {
  const resolvedPolicy = policy ?? await loadIncidentPolicy()
  const loaded = records ? { errors: [], records: records.map((record) => ({ file: `${record.id ?? 'unknown'}.json`, record })) } : await loadIncidentRecords(directory)
  const errors = [...loaded.errors]
  const seenIdentifiers = new Set()

  for (const { file, record } of loaded.records) {
    if (seenIdentifiers.has(record.id)) {
      errors.push(issue('duplicate-id', file, `L’identifiant ${record.id} est dupliqué.`))
    }
    seenIdentifiers.add(record.id)

    if (hasText(record.id) && basename(file, '.json') !== record.id) {
      errors.push(issue('filename-id-mismatch', file, 'Le nom du fichier doit correspondre à l’identifiant de la fiche.'))
    }

    const recordErrors = await validateIncidentRecord({ policy: resolvedPolicy, record, repositoryRoot: root })
    errors.push(...recordErrors.map((entry) => ({ ...entry, recordId: record.id ?? file })))
  }

  const statusCounts = Object.fromEntries(resolvedPolicy.statuses.map((status) => [status, 0]))
  loaded.records.forEach(({ record }) => {
    if (record && typeof record === 'object' && typeof record.status === 'string' && record.status in statusCounts) {
      statusCounts[record.status] += 1
    }
  })

  return {
    schemaVersion: 1,
    checkedAt: new Date().toISOString(),
    compliant: errors.length === 0,
    recordCount: loaded.records.length,
    statusCounts,
    errors,
    records: loaded.records.map(({ file, record }) => ({
      file,
      id: record.id,
      severity: record.classification?.severity,
      priority: record.classification?.priority,
      status: record.status,
    })),
  }
}

export const writeIncidentReport = async (outputPath, report) => {
  const absolutePath = resolve(outputPath)
  await mkdir(dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  return absolutePath
}

const isMainModule = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMainModule) {
  const report = await auditIncidentRegistry({
    directory: process.env.INCIDENT_DIRECTORY ? resolve(process.env.INCIDENT_DIRECTORY) : undefined,
    policy: await loadIncidentPolicy(process.env.INCIDENT_POLICY_PATH),
  })

  if (process.env.INCIDENT_REPORT_PATH) {
    await writeIncidentReport(process.env.INCIDENT_REPORT_PATH, report)
  }

  console.info(JSON.stringify(report, null, 2))

  if (!report.compliant) {
    process.exitCode = 1
  }
}
