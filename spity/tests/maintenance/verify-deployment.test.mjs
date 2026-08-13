import assert from 'node:assert/strict'
import { test } from 'node:test'
import { verifyDeployment } from '../../scripts/verify-deployment.mjs'

const responseFor = (payload) => async () => new Response(JSON.stringify(payload), {
  headers: { 'Content-Type': 'application/json' },
  status: 200,
})

const expected = {
  expectedRevision: 'a'.repeat(40),
  expectedVersion: '0.1.1',
  healthUrl: 'https://candidate.example.test/api/health',
  retries: 0,
}

test('accepts a candidate exposing the exact expected release metadata', async () => {
  const report = await verifyDeployment({
    ...expected,
    environment: 'staging',
    fetchImpl: responseFor({ status: 'ok', revision: expected.expectedRevision, version: expected.expectedVersion }),
  })

  assert.equal(report.result, 'passed')
  assert.equal(report.environment, 'staging')
  assert.deepEqual(report.expected, { revision: expected.expectedRevision, version: expected.expectedVersion })
  assert.deepEqual(report.observed, { revision: expected.expectedRevision, version: expected.expectedVersion })
})

test('rejects a candidate whose revision does not match the requested release', async () => {
  const report = await verifyDeployment({
    ...expected,
    fetchImpl: responseFor({ status: 'ok', revision: 'b'.repeat(40), version: expected.expectedVersion }),
  })

  assert.equal(report.result, 'failed')
  assert.equal(report.health.classification.code, 'revision_mismatch')
  assert.equal(report.observed.revision, 'b'.repeat(40))
})

test('requires the candidate URL and both immutable release identifiers', async () => {
  await assert.rejects(
    () => verifyDeployment({ healthUrl: expected.healthUrl, expectedRevision: expected.expectedRevision }),
    /EXPECTED_VERSION est requis/,
  )
})
