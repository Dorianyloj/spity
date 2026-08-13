import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { after, before, test } from 'node:test'
import { checkHealth } from '../../scripts/check-health.mjs'

let origin
let server

before(async () => {
  server = createServer((request, response) => {
    response.setHeader('Content-Type', 'application/json')

    if (request.url === '/healthy') {
      response.writeHead(200)
      response.end(JSON.stringify({ status: 'ok', version: 'exercise', revision: 'a'.repeat(40) }))
      return
    }

    if (request.url === '/invalid-json') {
      response.writeHead(200)
      response.end('not-json')
      return
    }

    response.writeHead(200)
    response.end(JSON.stringify({ status: 'degraded', version: 'exercise', revision: 'b'.repeat(40) }))
  })

  await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen))
  const address = server.address()
  origin = `http://127.0.0.1:${address.port}`
})

after(async () => {
  await new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()))
})

test('accepts a healthy response with version, revision and bounded latency', async () => {
  const report = await checkHealth({ url: `${origin}/healthy`, retries: 0, maxLatencyMs: 1_000 })

  assert.equal(report.status, 'healthy')
  assert.equal(report.indicators.applicationStatus, 'ok')
  assert.equal(report.indicators.version, 'exercise')
  assert.equal(report.indicators.revision, 'a'.repeat(40))
  assert.equal(report.availability, true)
  assert.equal(report.classification.code, 'healthy')
})

test('returns an actionable unhealthy report when the application is degraded', async () => {
  const report = await checkHealth({ url: `${origin}/degraded`, retries: 1, retryDelayMs: 1 })

  assert.equal(report.status, 'unhealthy')
  assert.equal(report.attempts.length, 2)
  assert.equal(report.availability, false)
  assert.equal(report.classification.code, 'application_status')
  assert.equal(report.classification.severity, 'S1')
  assert.match(report.error, /degraded/)
})

test('rejects an invalid health payload', async () => {
  const report = await checkHealth({ url: `${origin}/invalid-json`, retries: 0 })

  assert.equal(report.status, 'unhealthy')
  assert.equal(report.classification.code, 'invalid_json')
  assert.match(report.error, /JSON valide/)
})

test('keeps service availability when only the latency objective is breached', async () => {
  const report = await checkHealth({
    url: `${origin}/healthy`,
    maxLatencyMs: 0,
    retries: 0,
  })

  assert.equal(report.status, 'degraded')
  assert.equal(report.availability, true)
  assert.equal(report.classification.code, 'latency_threshold')
  assert.equal(report.classification.severity, 'S3')
})

test('rejects a healthy endpoint exposing an unexpected application version', async () => {
  const report = await checkHealth({
    expectedVersion: '0.1.1',
    retries: 0,
    url: `${origin}/healthy`,
  })

  assert.equal(report.status, 'degraded')
  assert.equal(report.availability, true)
  assert.equal(report.classification.code, 'version_mismatch')
  assert.equal(report.classification.expectedVersion, '0.1.1')
  assert.equal(report.classification.observedVersion, 'exercise')
})
