import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { auditIncidentRegistry, loadIncidentPolicy, loadIncidentRecords } from './check-incident-registry.mjs'
import { auditImprovementBacklog, loadImprovementPolicy, loadImprovementRecords } from './check-improvement-backlog.mjs'
import { auditReleaseJournal, loadReleaseJournalPolicy, loadReleaseJournalRecords } from './check-release-journal.mjs'
import { auditSupportCollaborations, loadSupportCollaborationPolicy, loadSupportCollaborationRecords } from './check-support-collaborations.mjs'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const applicationRoot = resolve(scriptDirectory, '..')
const repositoryRoot = resolve(applicationRoot, '..')

const issue = (code, path, message, competency = null) => ({ code, path, message, ...(competency ? { competency } : {}) })
const hasText = (value) => typeof value === 'string' && value.trim().length > 0
const clone = (value) => JSON.parse(JSON.stringify(value))

const getByPath = (value, path) => path.split('.').reduce((current, key) => current?.[key], value)

const resolveInsideRepository = (root, path) => {
  if (!hasText(path)) return null
  const absolutePath = resolve(root, path)
  const relativePath = relative(root, absolutePath)
  if (relativePath === '..' || relativePath.startsWith('../') || relativePath.startsWith('..\\') || isAbsolute(relativePath)) return null
  return absolutePath
}

const readRepositoryFile = async (root, path, errors, competency) => {
  const absolutePath = resolveInsideRepository(root, path)
  if (!absolutePath) {
    errors.push(issue('unsafe-required-path', path, 'Le chemin de contrôle doit rester dans le dépôt.', competency))
    return null
  }
  try {
    return await readFile(absolutePath)
  } catch {
    errors.push(issue('missing-required-file', path, 'Le fichier exigé par la revue finale est introuvable.', competency))
    return null
  }
}

export const loadBloc4AuditPolicy = async (policyPath = process.env.BLOC4_AUDIT_POLICY_PATH ?? resolve(applicationRoot, 'bloc4-audit-policy.json')) => {
  const policy = JSON.parse(await readFile(policyPath, 'utf8'))
  if (policy.schemaVersion !== 1 || !Array.isArray(policy.competencies) || policy.competencies.length !== 7) {
    throw new Error(`Politique de revue Bloc 4 invalide : ${policyPath}`)
  }
  return policy
}

export const parseManifest = (content) => {
  const entries = new Map()
  const errors = []
  const lines = content.toString('utf8').trim().split(/\r?\n/).filter(Boolean)
  lines.forEach((line, index) => {
    const match = line.match(/^([a-f0-9]{64})  (.+)$/)
    if (!match) {
      errors.push(issue('invalid-manifest-line', `line:${index + 1}`, 'Une ligne du manifeste SHA-256 est invalide.'))
      return
    }
    if (entries.has(match[2])) errors.push(issue('duplicate-manifest-path', match[2], 'Un chemin est dupliqué dans le manifeste.'))
    entries.set(match[2], match[1])
  })
  return { entries, errors }
}

export const validateManifest = async ({ root = repositoryRoot, manifestPath, requiredPaths = [] }) => {
  const errors = []
  const manifestContent = await readRepositoryFile(root, manifestPath, errors, 'Bloc 4')
  if (!manifestContent) return { compliant: false, entryCount: 0, errors }
  const parsed = parseManifest(manifestContent)
  errors.push(...parsed.errors)
  const required = [...new Set(requiredPaths)]
  for (const path of required) {
    if (!parsed.entries.has(path)) errors.push(issue('required-path-not-manifested', path, 'La pièce obligatoire doit être couverte par le manifeste.', 'Bloc 4'))
  }
  for (const [path, expectedHash] of parsed.entries) {
    const content = await readRepositoryFile(root, path, errors, 'Bloc 4')
    if (!content) continue
    const actualHash = createHash('sha256').update(content).digest('hex')
    if (actualHash !== expectedHash) errors.push(issue('manifest-hash-mismatch', path, 'Le SHA-256 ne correspond plus au contenu versionné.', 'Bloc 4'))
  }
  return { compliant: errors.length === 0, entryCount: parsed.entries.size, errors }
}

const validateCurrentRegistries = async () => {
  const [incidentPolicy, incidentRecords, improvementPolicy, improvementRecords, releasePolicy, releaseRecords, supportPolicy, supportRecords] = await Promise.all([
    loadIncidentPolicy(),
    loadIncidentRecords(),
    loadImprovementPolicy(),
    loadImprovementRecords(),
    loadReleaseJournalPolicy(),
    loadReleaseJournalRecords(),
    loadSupportCollaborationPolicy(),
    loadSupportCollaborationRecords(),
  ])
  const audits = {
    'C4.2.1': await auditIncidentRegistry({ policy: incidentPolicy, records: incidentRecords.records.map(({ record }) => record) }),
    'C4.3.1': await auditImprovementBacklog({ policy: improvementPolicy, records: improvementRecords.records.map(({ record }) => record) }),
    'C4.3.2': await auditReleaseJournal({ policy: releasePolicy, records: releaseRecords.records.map(({ record }) => record) }),
    'C4.3.3': await auditSupportCollaborations({ policy: supportPolicy, records: supportRecords.records.map(({ record }) => record) }),
  }
  const loadErrors = [
    ...incidentRecords.errors.map((entry) => ['C4.2.1', entry]),
    ...improvementRecords.errors.map((entry) => ['C4.3.1', entry]),
    ...releaseRecords.errors.map((entry) => ['C4.3.2', entry]),
    ...supportRecords.errors.map((entry) => ['C4.3.3', entry]),
  ].map(([competency, entry]) => issue('current-registry-load-error', entry.path ?? '$', `${competency} : ${entry.message ?? entry.code}`, competency))
  const auditErrors = Object.entries(audits)
    .filter(([, audit]) => !audit.compliant)
    .flatMap(([competency, audit]) => audit.errors.map((entry) => issue('current-registry-non-compliant', entry.path ?? '$', `${competency} : ${entry.message ?? entry.code}`, competency)))
  return { audits, errors: [...loadErrors, ...auditErrors] }
}

const validateAssertion = (evidence, assertion, errors, competency) => {
  const actual = getByPath(evidence, assertion.path)
  if ('equals' in assertion && actual !== assertion.equals) {
    errors.push(issue('evidence-assertion-failed', `${assertion.file}#${assertion.path}`, `Valeur attendue : ${JSON.stringify(assertion.equals)} ; valeur lue : ${JSON.stringify(actual)}.`, competency))
  }
  if ('minimum' in assertion && (!Number.isFinite(actual) || actual < assertion.minimum)) {
    errors.push(issue('evidence-minimum-not-reached', `${assertion.file}#${assertion.path}`, `Valeur minimale attendue : ${assertion.minimum} ; valeur lue : ${JSON.stringify(actual)}.`, competency))
  }
}

export const auditBloc4Completeness = async ({ policy, root = repositoryRoot } = {}) => {
  const resolvedPolicy = policy ?? await loadBloc4AuditPolicy()
  const errors = []
  const identifiers = new Set()
  const dossierContent = await readRepositoryFile(root, resolvedPolicy.dossierPath, errors, 'Bloc 4')
  const planContent = await readRepositoryFile(root, resolvedPolicy.planPath, errors, 'Bloc 4')
  await readRepositoryFile(root, resolvedPolicy.reviewPath, errors, 'Bloc 4')
  const dossier = dossierContent?.toString('utf8') ?? ''
  const plan = planContent?.toString('utf8') ?? ''
  const requiredManifestPaths = [resolvedPolicy.dossierPath, resolvedPolicy.planPath, resolvedPolicy.reviewPath]
  const evidenceCache = new Map()
  const competencies = []

  for (const competency of resolvedPolicy.competencies) {
    const competencyErrors = []
    if (!/^C4\.\d\.\d$/.test(competency.id ?? '') || identifiers.has(competency.id)) {
      competencyErrors.push(issue('invalid-or-duplicate-competency', '$.competencies', 'Chaque compétence doit avoir un identifiant C4 stable et unique.', competency.id))
    }
    identifiers.add(competency.id)
    const statusRow = dossier.split(/\r?\n/).find((line) => line.startsWith(`| ${competency.id} |`))
    if (!statusRow || !/Industrialisé et vérifié/.test(statusRow)) {
      competencyErrors.push(issue('dossier-status-missing', resolvedPolicy.dossierPath, 'Le dossier doit déclarer la compétence industrialisée et vérifiée.', competency.id))
    }
    if (!plan.includes(`## ${competency.id} - Résultat obtenu`)) {
      competencyErrors.push(issue('plan-result-missing', resolvedPolicy.planPath, 'Le plan doit contenir le résultat obtenu de la compétence.', competency.id))
    }
    const files = [...(competency.operationalFiles ?? []), ...(competency.evidenceFiles ?? [])]
    if (files.length === 0) competencyErrors.push(issue('missing-competency-files', '$.competencies', 'Chaque compétence doit référencer ses sources et ses preuves.', competency.id))
    for (const path of files) {
      requiredManifestPaths.push(path)
      await readRepositoryFile(root, path, competencyErrors, competency.id)
    }
    for (const assertion of competency.assertions ?? []) {
      requiredManifestPaths.push(assertion.file)
      let evidence = evidenceCache.get(assertion.file)
      if (!evidence) {
        const content = await readRepositoryFile(root, assertion.file, competencyErrors, competency.id)
        if (!content) continue
        try {
          evidence = JSON.parse(content.toString('utf8'))
          evidenceCache.set(assertion.file, evidence)
        } catch (error) {
          competencyErrors.push(issue('invalid-evidence-json', assertion.file, `La preuve JSON est invalide : ${error.message}`, competency.id))
          continue
        }
      }
      validateAssertion(evidence, assertion, competencyErrors, competency.id)
    }
    errors.push(...competencyErrors)
    competencies.push({
      id: competency.id,
      title: competency.title,
      compliant: competencyErrors.length === 0,
      operationalFileCount: competency.operationalFiles?.length ?? 0,
      evidenceFileCount: competency.evidenceFiles?.length ?? 0,
    })
  }

  const manifest = await validateManifest({ root, manifestPath: resolvedPolicy.manifestPath, requiredPaths: requiredManifestPaths })
  errors.push(...manifest.errors)
  const registries = await validateCurrentRegistries()
  errors.push(...registries.errors)
  return {
    schemaVersion: 1,
    checkedAt: new Date().toISOString(),
    compliant: errors.length === 0,
    competencyCount: competencies.length,
    compliantCompetencyCount: competencies.filter((competency) => competency.compliant).length,
    manifest: { compliant: manifest.compliant, entryCount: manifest.entryCount },
    registries: Object.fromEntries(Object.entries(registries.audits).map(([competency, audit]) => [competency, { compliant: audit.compliant, recordCount: audit.recordCount ?? null }])),
    competencies,
    errors,
  }
}

export const writeBloc4CompletenessReport = async (outputPath, report) => {
  const absolutePath = resolve(outputPath)
  await mkdir(dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  return absolutePath
}

const isMainModule = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMainModule) {
  const report = await auditBloc4Completeness()
  if (process.env.BLOC4_COMPLETENESS_REPORT_PATH) await writeBloc4CompletenessReport(process.env.BLOC4_COMPLETENESS_REPORT_PATH, report)
  console.info(JSON.stringify(report, null, 2))
  if (!report.compliant) process.exitCode = 1
}

export const cloneBloc4AuditPolicy = clone
