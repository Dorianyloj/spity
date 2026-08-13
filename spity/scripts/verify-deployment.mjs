import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkHealth } from './check-health.mjs'

const asPositiveInteger = (value, fallback) => {
  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback
}

const requireValue = (value, label) => {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} est requis pour vérifier un déploiement`)
  }

  return value.trim()
}

export const verifyDeployment = async ({
  environment = 'unspecified',
  expectedRevision,
  expectedVersion,
  fetchImpl,
  healthUrl,
  maxLatencyMs = 3_000,
  retries = 0,
  retryDelayMs = 500,
  timeoutMs = 15_000,
} = {}) => {
  const expected = {
    revision: requireValue(expectedRevision, 'EXPECTED_REVISION'),
    version: requireValue(expectedVersion, 'EXPECTED_VERSION'),
  }
  const report = await checkHealth({
    expectedRevision: expected.revision,
    expectedVersion: expected.version,
    fetchImpl,
    maxLatencyMs,
    retries,
    retryDelayMs,
    timeoutMs,
    url: requireValue(healthUrl, 'HEALTH_URL'),
  })

  return {
    schemaVersion: 1,
    criterion: 'C4.2.2',
    checkedAt: report.checkedAt,
    environment,
    expected,
    observed: {
      revision: report.indicators?.revision ?? report.classification?.observedRevision ?? null,
      version: report.indicators?.version ?? report.classification?.observedVersion ?? null,
    },
    result: report.status === 'healthy' ? 'passed' : 'failed',
    health: report,
  }
}

export const writeDeploymentVerificationReport = async (outputPath, report) => {
  const absolutePath = resolve(outputPath)
  await mkdir(dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  return absolutePath
}

const isMainModule = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMainModule) {
  const report = await verifyDeployment({
    environment: process.env.DEPLOYMENT_ENVIRONMENT ?? 'unspecified',
    expectedRevision: process.env.EXPECTED_REVISION,
    expectedVersion: process.env.EXPECTED_VERSION,
    healthUrl: process.env.HEALTH_URL,
    maxLatencyMs: asPositiveInteger(process.env.HEALTH_MAX_LATENCY_MS, 3_000),
    retries: asPositiveInteger(process.env.HEALTH_RETRIES, 0),
    retryDelayMs: asPositiveInteger(process.env.HEALTH_RETRY_DELAY_MS, 500),
    timeoutMs: asPositiveInteger(process.env.HEALTH_TIMEOUT_MS, 15_000),
  })

  if (process.env.HEALTH_OUTPUT_PATH) {
    await writeDeploymentVerificationReport(process.env.HEALTH_OUTPUT_PATH, report)
  }

  console.info(JSON.stringify(report, null, 2))

  if (report.result !== 'passed') {
    process.exitCode = 1
  }
}
