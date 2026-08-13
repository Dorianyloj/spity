import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const delay = (durationMs) => new Promise((resolveDelay) => setTimeout(resolveDelay, durationMs))

const asPositiveInteger = (value, fallback) => {
  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback
}

const errorMessage = (error) => error instanceof Error ? error.message : String(error)

export const checkHealth = async ({
  expectedRevision,
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
  let lastError = 'La sonde n’a pas été exécutée'

  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    const startedAt = performance.now()

    try {
      const response = await fetchImpl(target, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'spity-production-monitor/1.0',
        },
        signal: controller.signal,
      })
      const latencyMs = Math.round(performance.now() - startedAt)
      const rawBody = await response.text()
      let payload

      try {
        payload = JSON.parse(rawBody)
      } catch {
        throw new Error('La route de santé ne renvoie pas un JSON valide')
      }

      if (!response.ok) {
        throw new Error(`La route de santé répond avec le statut HTTP ${response.status}`)
      }

      if (payload?.status !== 'ok') {
        throw new Error(`Le statut applicatif attendu est "ok", valeur reçue : ${JSON.stringify(payload?.status)}`)
      }

      if (typeof payload.version !== 'string' || payload.version.trim() === '') {
        throw new Error('La version applicative est absente de la réponse')
      }

      if (typeof payload.revision !== 'string' || payload.revision.trim() === '') {
        throw new Error('La révision Git est absente de la réponse')
      }

      if (expectedRevision && payload.revision !== expectedRevision) {
        throw new Error(`La révision déployée ${payload.revision} diffère de la révision attendue ${expectedRevision}`)
      }

      if (latencyMs > maxLatencyMs) {
        throw new Error(`La latence ${latencyMs} ms dépasse le seuil de ${maxLatencyMs} ms`)
      }

      attempts.push({ attempt, httpStatus: response.status, latencyMs, outcome: 'success' })

      return {
        schemaVersion: 1,
        checkedAt,
        status: 'healthy',
        target: target.toString(),
        attempts,
        indicators: {
          applicationStatus: payload.status,
          httpStatus: response.status,
          latencyMs,
          maxLatencyMs,
          revision: payload.revision,
          version: payload.version,
        },
      }
    } catch (error) {
      lastError = errorMessage(error)
      attempts.push({
        attempt,
        latencyMs: Math.round(performance.now() - startedAt),
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
    schemaVersion: 1,
    checkedAt,
    status: 'unhealthy',
    target: target.toString(),
    attempts,
    error: lastError,
    thresholds: {
      maxLatencyMs,
      retries,
      timeoutMs,
    },
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
