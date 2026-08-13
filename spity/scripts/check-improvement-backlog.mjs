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

const activeStatuses = new Set(['proposed', 'under-review', 'approved', 'in-progress', 'validating'])
const issue = (code, path, message, recordId) => ({ code, path, message, ...(recordId ? { recordId } : {}) })
const hasText = (value) => typeof value === 'string' && value.trim().length > 0
const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value)
const asDate = (value) => {
  const date = new Date(value)
  return typeof value === 'string' && !Number.isNaN(date.valueOf()) ? date : null
}

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
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => scanSensitiveValue(item, `${path}.${key}`, findings))
  }

  return findings
}

const requireText = (value, path, errors, recordId) => {
  if (!hasText(value)) {
    errors.push(issue('required-text', path, 'Un texte non vide est requis.', recordId))
  }
}

const requireDate = (value, path, errors, recordId) => {
  if (!asDate(value)) {
    errors.push(issue('invalid-date', path, 'Une date ISO 8601 valide est requise.', recordId))
  }
}

const validateRepositoryPath = async (reference, path, errors, root, recordId) => {
  if (!reference || typeof reference !== 'object') {
    errors.push(issue('invalid-evidence', path, 'Une référence structurée est requise.', recordId))
    return
  }

  if (reference.kind === 'url') {
    try {
      const target = new URL(reference.value)
      if (target.protocol !== 'https:') {
        errors.push(issue('invalid-evidence-url', path, 'Une URL de preuve doit utiliser HTTPS.', recordId))
      }
    } catch {
      errors.push(issue('invalid-evidence-url', path, 'Une URL de preuve valide est requise.', recordId))
    }
    return
  }

  if (reference.kind !== 'repository-path' || !hasText(reference.value)) {
    errors.push(issue('invalid-evidence-kind', path, 'La preuve doit être un chemin du dépôt ou une URL HTTPS.', recordId))
    return
  }

  const rootPath = resolve(root)
  const absolutePath = resolve(rootPath, reference.value)
  const pathFromRoot = relative(rootPath, absolutePath)
  if (pathFromRoot === '..' || pathFromRoot.startsWith('../') || pathFromRoot.startsWith('..\\') || isAbsolute(pathFromRoot)) {
    errors.push(issue('evidence-outside-repository', path, 'La preuve doit rester dans le dépôt.', recordId))
    return
  }

  try {
    await access(absolutePath, constants.R_OK)
  } catch {
    errors.push(issue('evidence-not-found', path, `Preuve introuvable : ${reference.value}`, recordId))
  }
}

const validateScore = (record, policy, errors, recordId) => {
  const scoring = record.scoring
  if (!scoring || typeof scoring !== 'object') {
    errors.push(issue('invalid-scoring', '$.scoring', 'La cotation est requise.', recordId))
    return
  }

  const dimensions = ['impact', 'riskReduction', 'confidence', 'effort']
  for (const dimension of dimensions) {
    const value = scoring[dimension]
    if (!Number.isInteger(value) || value < policy.scoring.range.minimum || value > policy.scoring.range.maximum) {
      errors.push(issue('invalid-score-dimension', `$.scoring.${dimension}`, 'Chaque dimension doit être un entier dans la plage de la politique.', recordId))
    }
  }

  const expectedScore = scoring.impact * 3 + scoring.riskReduction * 2 + scoring.confidence - scoring.effort
  if (!Number.isInteger(scoring.score) || scoring.score !== expectedScore) {
    errors.push(issue('score-mismatch', '$.scoring.score', `Le score doit valoir ${expectedScore} selon la formule versionnée.`, recordId))
  }
}

const validateIndicators = (record, errors, recordId) => {
  if (!Array.isArray(record.indicators) || record.indicators.length === 0) {
    errors.push(issue('missing-indicators', '$.indicators', 'Au moins un indicateur mesurable est requis.', recordId))
    return
  }

  record.indicators.forEach((indicator, index) => {
    const path = `$.indicators[${index}]`
    if (!indicator || typeof indicator !== 'object') {
      errors.push(issue('invalid-indicator', path, 'Un indicateur structuré est requis.', recordId))
      return
    }
    ;['id', 'label', 'unit', 'measurement'].forEach((key) => requireText(indicator[key], `${path}.${key}`, errors, recordId))
    if (!isFiniteNumber(indicator.baseline) || !isFiniteNumber(indicator.target)) {
      errors.push(issue('invalid-indicator-value', path, 'La référence et la cible doivent être numériques.', recordId))
    }
    if (!['increase', 'decrease'].includes(indicator.direction)) {
      errors.push(issue('invalid-indicator-direction', `${path}.direction`, 'La direction doit être increase ou decrease.', recordId))
    }
    if (indicator.direction === 'increase' && isFiniteNumber(indicator.baseline) && isFiniteNumber(indicator.target) && indicator.target <= indicator.baseline) {
      errors.push(issue('invalid-indicator-target', path, 'Une cible en hausse doit être supérieure à la référence.', recordId))
    }
    if (indicator.direction === 'decrease' && isFiniteNumber(indicator.baseline) && isFiniteNumber(indicator.target) && indicator.target >= indicator.baseline) {
      errors.push(issue('invalid-indicator-target', path, 'Une cible en baisse doit être inférieure à la référence.', recordId))
    }
  })
}

const validateFeedback = (record, policy, errors, recordId) => {
  if (!Array.isArray(record.feedbackInputs) || record.feedbackInputs.length === 0) {
    errors.push(issue('missing-feedback', '$.feedbackInputs', 'Au moins une source opérationnelle ou de retour est requise.', recordId))
    return
  }

  record.feedbackInputs.forEach((input, index) => {
    const path = `$.feedbackInputs[${index}]`
    if (!input || typeof input !== 'object') {
      errors.push(issue('invalid-feedback', path, 'Une source de retour structurée est requise.', recordId))
      return
    }
    if (!policy.feedback.allowedKinds.includes(input.kind)) {
      errors.push(issue('invalid-feedback-kind', `${path}.kind`, 'Le type de source n’est pas autorisé.', recordId))
    }
    ;['reference', 'summary'].forEach((key) => requireText(input[key], `${path}.${key}`, errors, recordId))
    requireDate(input.declaredAt, `${path}.declaredAt`, errors, recordId)
    if (input.kind === 'controlled-simulation' && (!hasText(input.disclosure) || !/fictive|simulation/i.test(input.disclosure))) {
      errors.push(issue('simulation-disclosure-required', `${path}.disclosure`, 'Une source simulée doit être explicitement déclarée.', recordId))
    }
  })
}

const validateHistory = (record, policy, errors, recordId) => {
  if (!Array.isArray(record.history) || record.history.length === 0) {
    errors.push(issue('missing-history', '$.history', 'Un historique de décision est requis.', recordId))
    return
  }

  let previousDate = null
  record.history.forEach((entry, index) => {
    const path = `$.history[${index}]`
    if (!entry || typeof entry !== 'object') {
      errors.push(issue('invalid-history-entry', path, 'Une étape d’historique structurée est requise.', recordId))
      return
    }
    const date = asDate(entry.at)
    requireDate(entry.at, `${path}.at`, errors, recordId)
    requireText(entry.actorRole, `${path}.actorRole`, errors, recordId)
    requireText(entry.reason, `${path}.reason`, errors, recordId)
    if (!policy.statuses.includes(entry.to)) {
      errors.push(issue('invalid-history-status', `${path}.to`, 'Le statut historique n’est pas autorisé.', recordId))
    }
    if (date && previousDate && date < previousDate) {
      errors.push(issue('non-chronological-history', `${path}.at`, 'L’historique doit être chronologique.', recordId))
    }
    previousDate = date ?? previousDate
  })

  const latest = record.history.at(-1)
  if (latest?.to !== record.status) {
    errors.push(issue('status-history-mismatch', '$.status', 'Le statut courant doit correspondre à la dernière décision.', recordId))
  }
}

export const validateImprovementRecord = async ({ policy, record, root = repositoryRoot }) => {
  const errors = []
  const recordId = record?.id

  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return [issue('invalid-record', '$', 'Une fiche d’amélioration JSON est requise.')]
  }

  if (record.schemaVersion !== 1) {
    errors.push(issue('invalid-schema-version', '$.schemaVersion', 'schemaVersion 1 est requis.', recordId))
  }
  if (!hasText(record.id) || !(new RegExp(policy.identifier.pattern)).test(record.id)) {
    errors.push(issue('invalid-id', '$.id', 'L’identifiant stable ne respecte pas la politique.', recordId))
  }
  ;['title', 'description'].forEach((key) => requireText(record[key], `$.${key}`, errors, recordId))
  if (!policy.statuses.includes(record.status)) {
    errors.push(issue('invalid-status', '$.status', 'Le statut n’est pas autorisé.', recordId))
  }
  if (!Number.isInteger(record.priority) || record.priority < 1) {
    errors.push(issue('invalid-priority', '$.priority', 'La priorité doit être un entier positif.', recordId))
  }

  validateScore(record, policy, errors, recordId)
  validateIndicators(record, errors, recordId)
  validateFeedback(record, policy, errors, recordId)
  validateHistory(record, policy, errors, recordId)

  if (!record.delivery || typeof record.delivery !== 'object') {
    errors.push(issue('missing-delivery', '$.delivery', 'Le coût, le délai et le retour arrière sont requis.', recordId))
  } else {
    if (!isFiniteNumber(record.delivery.estimatedCalendarDays) || record.delivery.estimatedCalendarDays <= 0) {
      errors.push(issue('invalid-duration', '$.delivery.estimatedCalendarDays', 'Le délai doit être positif.', recordId))
    }
    if (!isFiniteNumber(record.delivery.estimatedPersonDays) || record.delivery.estimatedPersonDays <= 0) {
      errors.push(issue('invalid-cost', '$.delivery.estimatedPersonDays', 'Le coût doit être positif.', recordId))
    }
    requireText(record.delivery.rollback, '$.delivery.rollback', errors, recordId)
  }

  if (!record.decision || typeof record.decision !== 'object') {
    errors.push(issue('missing-decision', '$.decision', 'Une décision attribuée est requise.', recordId))
  } else {
    ;['selected', 'rationale', 'ownerRole', 'reviewerRole'].forEach((key) => requireText(record.decision[key], `$.decision.${key}`, errors, recordId))
    requireDate(record.decision.decidedAt, '$.decision.decidedAt', errors, recordId)
  }

  if (!Array.isArray(record.evidence) || record.evidence.length === 0) {
    errors.push(issue('missing-evidence', '$.evidence', 'Au moins une preuve est requise.', recordId))
  } else {
    await Promise.all(record.evidence.map((reference, index) => validateRepositoryPath(reference, `$.evidence[${index}]`, errors, root, recordId)))
  }

  if (record.status === 'completed') {
    if (!record.outcome || typeof record.outcome !== 'object') {
      errors.push(issue('outcome-required', '$.outcome', 'Une amélioration terminée doit décrire son résultat.', recordId))
    } else {
      requireText(record.outcome.summary, '$.outcome.summary', errors, recordId)
      requireDate(record.outcome.verifiedAt, '$.outcome.verifiedAt', errors, recordId)
    }
  }

  scanSensitiveValue(record).forEach((entry) => errors.push({ ...entry, recordId }))
  return errors
}

export const loadImprovementPolicy = async (policyPath = process.env.IMPROVEMENT_POLICY_PATH ?? resolve(applicationRoot, 'improvement-policy.json')) => {
  return JSON.parse(await readFile(policyPath, 'utf8'))
}

export const loadImprovementRecords = async (directory = process.env.IMPROVEMENT_DIRECTORY ?? resolve(applicationRoot, 'improvements')) => {
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

export const auditImprovementBacklog = async ({ policy, records, root = repositoryRoot }) => {
  const errors = []
  const ids = new Set()
  const activePriorities = new Set()
  const statusCounts = Object.fromEntries(policy.statuses.map((status) => [status, 0]))

  for (const record of records) {
    if (record && typeof record === 'object' && typeof record.status === 'string' && record.status in statusCounts) {
      statusCounts[record.status] += 1
    }
    const recordErrors = await validateImprovementRecord({ policy, record, root })
    errors.push(...recordErrors)
    if (hasText(record?.id)) {
      if (ids.has(record.id)) {
        errors.push(issue('duplicate-id', '$.id', `Identifiant dupliqué : ${record.id}`, record.id))
      }
      ids.add(record.id)
    }
    if (activeStatuses.has(record?.status) && Number.isInteger(record?.priority)) {
      if (activePriorities.has(record.priority)) {
        errors.push(issue('duplicate-active-priority', '$.priority', `Priorité active dupliquée : ${record.priority}`, record.id))
      }
      activePriorities.add(record.priority)
    }
  }

  if (!records.some((record) => Array.isArray(record?.feedbackInputs) && record.feedbackInputs.some((input) => input?.kind === 'user-feedback' || input?.kind === 'controlled-simulation'))) {
    errors.push(issue('missing-feedback-analysis', '$', 'Le backlog doit déclarer au moins un retour utilisateur ou une simulation explicitement identifiée.'))
  }

  const expectedOrder = records
    .filter((record) => activeStatuses.has(record?.status) && Number.isInteger(record?.priority) && Number.isInteger(record?.scoring?.score) && Number.isInteger(record?.scoring?.effort))
    .sort((left, right) => right.scoring.score - left.scoring.score || left.scoring.effort - right.scoring.effort || left.id.localeCompare(right.id, 'fr'))

  expectedOrder.forEach((record, index) => {
    if (record.priority !== index + 1) {
      errors.push(issue('priority-order-mismatch', '$.priority', `La priorité ${index + 1} est attendue selon le score et l’effort.`, record.id))
    }
  })

  return {
    schemaVersion: 1,
    checkedAt: new Date().toISOString(),
    compliant: errors.length === 0,
    recordCount: records.length,
    statusCounts,
    errors,
    records: records.map((record) => ({ id: record?.id ?? null, priority: record?.priority ?? null, score: record?.scoring?.score ?? null, status: record?.status ?? null }))
      .sort((left, right) => (left.priority ?? Number.MAX_SAFE_INTEGER) - (right.priority ?? Number.MAX_SAFE_INTEGER)),
  }
}

export const writeImprovementReport = async (outputPath, report) => {
  const absolutePath = resolve(outputPath)
  await mkdir(dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  return absolutePath
}

const isMainModule = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMainModule) {
  const policy = await loadImprovementPolicy()
  const loaded = await loadImprovementRecords()
  const report = await auditImprovementBacklog({ policy, records: loaded.records.map(({ record }) => record) })
  report.errors.unshift(...loaded.errors)
  report.compliant = report.errors.length === 0

  if (process.env.IMPROVEMENT_REPORT_PATH) {
    await writeImprovementReport(process.env.IMPROVEMENT_REPORT_PATH, report)
  }
  console.info(JSON.stringify(report, null, 2))
  if (!report.compliant) {
    process.exitCode = 1
  }
}
