import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const delay = (durationMs) => new Promise((resolveDelay) => setTimeout(resolveDelay, durationMs))

const asPositiveInteger = (value, fallback) => {
  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback
}

class ProbeFailure extends Error {
  constructor(code, message, details = {}) {
    super(message)
    this.code = code
    this.details = details
  }
}

const classifications = {
  application_status: { category: 'application', severity: 'S1', impactsAvailability: true, runbook: 'incident-production' },
  healthy: { category: 'healthy', severity: null, impactsAvailability: false, runbook: 'none' },
  http_status: { category: 'network-or-http', severity: 'S1', impactsAvailability: true, runbook: 'incident-production' },
  invalid_json: { category: 'application', severity: 'S1', impactsAvailability: true, runbook: 'incident-production' },
  latency_threshold: { category: 'performance', severity: 'S3', impactsAvailability: false, runbook: 'performance-review' },
  metadata_missing: { category: 'observability-contract', severity: 'S2', impactsAvailability: false, runbook: 'deployment-verification' },
  network_error: { category: 'network-or-http', severity: 'S1', impactsAvailability: true, runbook: 'incident-production' },
  revision_mismatch: { category: 'deployment', severity: 'S3', impactsAvailability: false, runbook: 'deployment-verification' },
  timeout: { category: 'network-or-http', severity: 'S1', impactsAvailability: true, runbook: 'incident-production' },
  version_mismatch: { category: 'deployment', severity: 'S3', impactsAvailability: false, runbook: 'deployment-verification' },
}

const classifyFailure = (error) => {
  if (error instanceof ProbeFailure) {
    return { code: error.code, ...classifications[error.code], ...error.details }
  }

  if (error instanceof Error && error.name === 'AbortError') {
    return { code: 'timeout', ...classifications.timeout }
  }

  return { code: 'network_error', ...classifications.network_error }
}

const errorMessage = (error) => error instanceof Error ? error.message : String(error)

export const checkHealth = async ({
  expectedRevision,
  expectedVersion,
  fetchImpl = fetch,
  maxLatencyMs = 3_000,
  retries = 2,
  retryDelayMs = 500,
  timeoutMs = 15_000,
  url,
} = {}) => {
  if (!url) {
    throw new Error('Une URL de supervision est requise')
  }

  const target = new URL(url)

  if (!['http:', 'https:'].includes(target.protocol)) {
    throw new Error('La supervision accepte uniquement les protocoles HTTP et HTTPS')
  }

  const checkedAt = new Date().toISOString()
  const attempts = []
  let lastFailure
  let lastError = 'La sonde n’a pas été exécutée'

  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    const startedAt = performance.now()

    try {
      const response = await fetchImpl(target, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'spity-production-monitor/2.0',
        },
        signal: controller.signal,
      })
      const rawBody = await response.text()
      const latencyMs = Math.round(performance.now() - startedAt)

      if (!response.ok) {
        throw new ProbeFailure('http_status', `La route de santé répond avec le statut HTTP ${response.status}`, { httpStatus: response.status })
      }

      let payload

      try {
        payload = JSON.parse(rawBody)
      } catch {
        throw new ProbeFailure('invalid_json', 'La route de santé ne renvoie pas un JSON valide', { httpStatus: response.status })
      }

      if (payload?.status !== 'ok') {
        throw new ProbeFailure(
          'application_status',
          `Le statut applicatif attendu est "ok", valeur reçue : ${JSON.stringify(payload?.status)}`,
          { applicationStatus: payload?.status, httpStatus: response.status },
        )
      }

      if (typeof payload.version !== 'string' || payload.version.trim() === '') {
        throw new ProbeFailure('metadata_missing', 'La version applicative est absente de la réponse', { httpStatus: response.status })
      }

      if (typeof payload.revision !== 'string' || payload.revision.trim() === '') {
        throw new ProbeFailure('metadata_missing', 'La révision Git est absente de la réponse', { httpStatus: response.status })
      }

      if (expectedVersion && payload.version !== expectedVersion) {
        throw new ProbeFailure(
          'version_mismatch',
          `La version déployée ${payload.version} diffère de la version attendue ${expectedVersion}`,
          { expectedVersion, observedVersion: payload.version, httpStatus: response.status },
        )
      }

      if (expectedRevision && payload.revision !== expectedRevision) {
        throw new ProbeFailure(
          'revision_mismatch',
          `La révision déployée ${payload.revision} diffère de la révision attendue ${expectedRevision}`,
          { expectedRevision, observedRevision: payload.revision, httpStatus: response.status },
        )
      }

      if (latencyMs > maxLatencyMs) {
        throw new ProbeFailure(
          'latency_threshold',
          `La latence ${latencyMs} ms dépasse le seuil de ${maxLatencyMs} ms`,
          { httpStatus: response.status, latencyMs, maxLatencyMs },
        )
      }

      attempts.push({ attempt, httpStatus: response.status, latencyMs, outcome: 'success', code: 'healthy' })

      return {
        schemaVersion: 2,
        checkedAt,
        status: 'healthy',
        availability: true,
        target: target.toString(),
        attempts,
        classification: { code: 'healthy', ...classifications.healthy },
        indicators: {
          applicationStatus: payload.status,
          httpStatus: response.status,
          latencyMs,
          maxLatencyMs,
          revision: payload.revision,
          version: payload.version,
        },
        thresholds: { maxLatencyMs, retries, timeoutMs },
      }
    } catch (error) {
      const failure = classifyFailure(error)
      lastFailure = failure
      lastError = errorMessage(error)
      attempts.push({
        attempt,
        code: failure.code,
        httpStatus: failure.httpStatus,
        latencyMs: failure.latencyMs ?? Math.round(performance.now() - startedAt),
        outcome: 'failure',
        error: lastError,
      })
    } finally {
      clearTimeout(timeout)
    }

    if (attempt <= retries) {
      await delay(retryDelayMs)
    }
  }

  return {
    schemaVersion: 2,
    checkedAt,
    status: lastFailure.impactsAvailability ? 'unhealthy' : 'degraded',
    availability: !lastFailure.impactsAvailability,
    target: target.toString(),
    attempts,
    classification: lastFailure,
    error: lastError,
    thresholds: { maxLatencyMs, retries, timeoutMs },
  }
}

export const writeHealthReport = async (outputPath, report) => {
  const absolutePath = resolve(outputPath)
  await mkdir(dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  return absolutePath
}

const isMainModule = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMainModule) {
  const report = await checkHealth({
    expectedRevision: process.env.EXPECTED_REVISION || undefined,
    expectedVersion: process.env.EXPECTED_VERSION || undefined,
    maxLatencyMs: asPositiveInteger(process.env.HEALTH_MAX_LATENCY_MS, 3_000),
    retries: asPositiveInteger(process.env.HEALTH_RETRIES, 2),
    retryDelayMs: asPositiveInteger(process.env.HEALTH_RETRY_DELAY_MS, 500),
    timeoutMs: asPositiveInteger(process.env.HEALTH_TIMEOUT_MS, 15_000),
    url: process.env.HEALTH_URL ?? 'https://spity.fr/api/health',
  })

  if (process.env.HEALTH_OUTPUT_PATH) {
    await writeHealthReport(process.env.HEALTH_OUTPUT_PATH, report)
  }

  console.info(JSON.stringify(report, null, 2))

  if (report.status !== 'healthy') {
    process.exitCode = 1
  }
}
