import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkHealth, writeHealthReport } from './check-health.mjs'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const applicationRoot = resolve(scriptDirectory, '..')

const asPositiveInteger = (value, fallback) => {
  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback
}

export const loadMonitoringPolicy = async (policyPath = resolve(applicationRoot, 'monitoring-policy.json')) => {
  const policy = JSON.parse(await readFile(policyPath, 'utf8'))

  if (policy.schemaVersion !== 1 || !policy.service?.publicHealthUrl || !policy.probe) {
    throw new Error(`Politique de supervision invalide : ${policyPath}`)
  }

  return policy
}

export const runProductionMonitor = async ({
  expectedRevision = process.env.EXPECTED_REVISION || undefined,
  healthUrl = process.env.HEALTH_URL,
  policy,
} = {}) => {
  const resolvedPolicy = policy ?? await loadMonitoringPolicy(process.env.MONITORING_POLICY_PATH)
  const report = await checkHealth({
    expectedRevision,
    maxLatencyMs: asPositiveInteger(process.env.HEALTH_MAX_LATENCY_MS, resolvedPolicy.probe.maxLatencyMs),
    retries: asPositiveInteger(process.env.HEALTH_RETRIES, resolvedPolicy.probe.retries),
    retryDelayMs: asPositiveInteger(process.env.HEALTH_RETRY_DELAY_MS, resolvedPolicy.probe.retryDelayMs),
    timeoutMs: asPositiveInteger(process.env.HEALTH_TIMEOUT_MS, resolvedPolicy.probe.timeoutMs),
    url: healthUrl || resolvedPolicy.service.publicHealthUrl,
  })

  return {
    ...report,
    monitoring: {
      policySchemaVersion: resolvedPolicy.schemaVersion,
      service: resolvedPolicy.service.name,
      intervalMinutes: resolvedPolicy.probe.intervalMinutes,
      availabilityTargetPercent: resolvedPolicy.objectives.availability.targetPercent,
    },
  }
}

const isMainModule = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMainModule) {
  const report = await runProductionMonitor()
  const outputPath = process.env.MONITORING_OUTPUT_PATH ?? '.monitoring/production-health.json'

  await writeHealthReport(outputPath, report)
  console.info(JSON.stringify(report, null, 2))

  if (report.status !== 'healthy') {
    process.exitCode = 1
  }
}
