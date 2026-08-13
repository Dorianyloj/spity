import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const severityRank = {
  info: 0,
  low: 1,
  moderate: 2,
  high: 3,
  critical: 4,
}

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const applicationRoot = resolve(scriptDirectory, '..')
const repositoryRoot = resolve(applicationRoot, '..')

const assertSeverity = (severity, field) => {
  if (!(severity in severityRank)) {
    throw new Error(`${field} contient une sévérité inconnue : ${severity}`)
  }
}

const vulnerabilityEntries = (audit) => Object.entries(audit?.vulnerabilities ?? {})
  .map(([name, vulnerability]) => ({
    name,
    severity: vulnerability.severity,
    isDirect: Boolean(vulnerability.isDirect),
    via: vulnerability.via ?? [],
    nodes: vulnerability.nodes ?? [],
    fixAvailable: vulnerability.fixAvailable ?? false,
  }))

const isAtOrAbove = (severity, threshold) => severityRank[severity] >= severityRank[threshold]

const validateException = (exception) => {
  if (!Array.isArray(exception.packages) || exception.packages.length === 0) {
    throw new Error('Chaque exception doit cibler au moins un package.')
  }
  if (!exception.owner || !exception.reason || !exception.expiresOn) {
    throw new Error(`Exception incomplète pour ${exception.packages.join(', ')}.`)
  }
  const expiry = new Date(`${exception.expiresOn}T23:59:59.999Z`)
  if (Number.isNaN(expiry.getTime())) {
    throw new Error(`Date d'expiration invalide : ${exception.expiresOn}`)
  }
  return expiry
}

const withoutInternalExpiry = (exception) => {
  const copy = { ...exception }
  delete copy.expiry
  return copy
}

export const evaluateDependencyPolicy = ({
  policy,
  productionAudit,
  completeAudit,
  installedVersions = null,
  now = new Date(),
}) => {
  if (policy?.schemaVersion !== 1) {
    throw new Error('La politique de dépendances doit utiliser schemaVersion 1.')
  }

  const productionThreshold = policy.production?.blockAtOrAbove
  const developmentThreshold = policy.development?.blockAtOrAbove
  const maximumExceptionSeverity = policy.development?.maximumExceptionSeverity
  assertSeverity(productionThreshold, 'production.blockAtOrAbove')
  assertSeverity(developmentThreshold, 'development.blockAtOrAbove')
  assertSeverity(maximumExceptionSeverity, 'development.maximumExceptionSeverity')

  const exceptions = policy.development.exceptions ?? []
  const exceptionState = exceptions.map((exception) => ({
    ...exception,
    expiry: validateException(exception),
    usedBy: [],
  }))

  const productionEntries = vulnerabilityEntries(productionAudit)
  const productionNames = new Set(productionEntries.map((entry) => entry.name))
  const productionViolations = productionEntries
    .filter((entry) => isAtOrAbove(entry.severity, productionThreshold))
    .map((entry) => ({ ...entry, reason: `vulnérabilité de production >= ${productionThreshold}` }))

  const developmentViolations = []
  for (const entry of vulnerabilityEntries(completeAudit)) {
    if (productionNames.has(entry.name) || !isAtOrAbove(entry.severity, developmentThreshold)) {
      continue
    }

    const exception = exceptionState.find((candidate) => candidate.packages.includes(entry.name))
    const exceptionAllowed = exception
      && now.getTime() <= exception.expiry.getTime()
      && severityRank[entry.severity] <= severityRank[maximumExceptionSeverity]

    if (exceptionAllowed) {
      exception.usedBy.push(entry.name)
      continue
    }

    let reason = `vulnérabilité de développement >= ${developmentThreshold} sans exception valide`
    if (exception && now.getTime() > exception.expiry.getTime()) {
      reason = `exception expirée le ${exception.expiresOn}`
    } else if (exception && severityRank[entry.severity] > severityRank[maximumExceptionSeverity]) {
      reason = `sévérité ${entry.severity} supérieure au maximum dérogeable ${maximumExceptionSeverity}`
    }
    developmentViolations.push({ ...entry, reason })
  }

  const exceptionsUsed = exceptionState
    .filter((exception) => exception.usedBy.length > 0)
    .map(withoutInternalExpiry)
  const staleExceptions = exceptionState
    .filter((exception) => exception.usedBy.length === 0)
    .map(withoutInternalExpiry)

  const versionPins = (policy.versionPins ?? []).map((pin) => {
    if (!pin.package || !pin.version || !pin.owner || !pin.reason || !pin.expiresOn) {
      throw new Error('Chaque version verrouillée doit définir package, version, owner, reason et expiresOn.')
    }
    const expiry = new Date(`${pin.expiresOn}T23:59:59.999Z`)
    if (Number.isNaN(expiry.getTime())) {
      throw new Error(`Date d'expiration invalide pour ${pin.package} : ${pin.expiresOn}`)
    }
    return {
      ...pin,
      installedVersion: installedVersions?.[pin.package] ?? null,
      expired: now.getTime() > expiry.getTime(),
      mismatched: Boolean(installedVersions && installedVersions[pin.package] !== pin.version),
    }
  })
  const expiredVersionPins = versionPins.filter((pin) => pin.expired)
  const mismatchedVersionPins = versionPins.filter((pin) => pin.mismatched)

  return {
    compliant: productionViolations.length === 0
      && developmentViolations.length === 0
      && expiredVersionPins.length === 0
      && mismatchedVersionPins.length === 0,
    thresholds: {
      production: productionThreshold,
      development: developmentThreshold,
      maximumExceptionSeverity,
    },
    auditSummary: {
      production: productionAudit?.metadata?.vulnerabilities ?? null,
      complete: completeAudit?.metadata?.vulnerabilities ?? null,
    },
    productionViolations,
    developmentViolations,
    exceptionsUsed,
    staleExceptions,
    versionPins,
    expiredVersionPins,
    mismatchedVersionPins,
  }
}

const runNpmJson = (arguments_) => {
  const npmCli = process.env.npm_execpath
  if (!npmCli) {
    throw new Error('Ce contrôle doit être exécuté via npm afin de localiser le client npm de façon portable.')
  }

  const result = spawnSync(process.execPath, [npmCli, ...arguments_], {
    cwd: applicationRoot,
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
  })

  if (result.error) {
    throw result.error
  }
  if (!result.stdout.trim()) {
    throw new Error(`npm ${arguments_.join(' ')} n'a produit aucun JSON.\n${result.stderr}`)
  }

  try {
    return JSON.parse(result.stdout)
  } catch (error) {
    throw new Error(`Réponse JSON invalide pour npm ${arguments_.join(' ')} : ${error.message}`)
  }
}

const main = async () => {
  const policyPath = resolve(applicationRoot, 'dependency-policy.json')
  const outputDirectory = resolve(
    process.env.DEPENDENCY_REPORT_DIR || resolve(repositoryRoot, 'tmp', 'dependency-maintenance'),
  )

  const [policyContent, lockfile] = await Promise.all([
    readFile(policyPath, 'utf8'),
    readFile(resolve(applicationRoot, 'package-lock.json')),
  ])
  const policy = JSON.parse(policyContent)
  const packageLock = JSON.parse(lockfile.toString('utf8'))
  const installedVersions = Object.fromEntries(
    Object.entries(packageLock.packages ?? {})
      .filter(([path, value]) => path.startsWith('node_modules/') && value?.version)
      .map(([path, value]) => [path.slice('node_modules/'.length), value.version]),
  )
  const productionAudit = runNpmJson(['audit', '--omit=dev', '--json'])
  const completeAudit = runNpmJson(['audit', '--json'])
  const outdated = runNpmJson(['outdated', '--json'])
  const sbom = runNpmJson(['sbom', '--sbom-format', 'cyclonedx'])
  const evaluation = evaluateDependencyPolicy({
    policy,
    productionAudit,
    completeAudit,
    installedVersions,
  })
  const sbomContent = `${JSON.stringify(sbom, null, 2)}\n`

  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    nodeVersion: process.version,
    lockfileSha256: createHash('sha256').update(lockfile).digest('hex'),
    policy,
    evaluation,
    outdated: Object.entries(outdated).map(([name, value]) => ({
      name,
      current: value.current,
      wanted: value.wanted,
      latest: value.latest,
      dependencyType: value.type ?? null,
    })),
    sbom: {
      bomFormat: sbom.bomFormat,
      specVersion: sbom.specVersion,
      serialNumber: sbom.serialNumber,
      componentCount: sbom.components?.length ?? 0,
      sha256: createHash('sha256').update(sbomContent).digest('hex'),
    },
  }

  await mkdir(outputDirectory, { recursive: true })
  await Promise.all([
    writeFile(resolve(outputDirectory, 'dependency-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8'),
    writeFile(resolve(outputDirectory, 'sbom.cdx.json'), sbomContent, 'utf8'),
  ])

  if (process.env.DEPENDENCY_EVIDENCE_PATH) {
    const evidencePath = resolve(process.env.DEPENDENCY_EVIDENCE_PATH)
    await mkdir(dirname(evidencePath), { recursive: true })
    await writeFile(evidencePath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  }

  console.info(`Politique de dépendances : ${evaluation.compliant ? 'conforme' : 'non conforme'}`)
  console.info(`Audit production : ${evaluation.auditSummary.production?.total ?? 'inconnu'} vulnérabilité(s)`)
  console.info(`Audit complet : ${evaluation.auditSummary.complete?.total ?? 'inconnu'} vulnérabilité(s)`)
  console.info(`Exceptions utilisées : ${evaluation.exceptionsUsed.length}`)
  console.info(`Versions verrouillées et datées : ${evaluation.versionPins.length}`)
  console.info(`Mises à jour disponibles : ${report.outdated.length}`)
  console.info(`Rapports : ${outputDirectory}`)

  if (!evaluation.compliant) {
    process.exitCode = 1
  }
}

const isDirectExecution = process.argv[1]
  && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectExecution) {
  await main()
}
