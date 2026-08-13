import assert from 'node:assert/strict'
import { test } from 'node:test'
import { auditIncidentRegistry, loadIncidentPolicy, loadIncidentRecords } from '../../scripts/check-incident-registry.mjs'

const clone = (value) => JSON.parse(JSON.stringify(value))
const policy = await loadIncidentPolicy()
const canonicalRecords = (await loadIncidentRecords()).records.map(({ record }) => record)

test('accepts the canonical incident registry and reports its lifecycle distribution', async () => {
  const report = await auditIncidentRegistry({ policy, records: canonicalRecords })

  assert.equal(report.compliant, true)
  assert.equal(report.recordCount, 2)
  assert.equal(report.statusCounts.closed, 1)
  assert.equal(report.statusCounts.planned, 1)
})

test('rejects a lifecycle transition that skips investigation and resolution', async () => {
  const records = clone(canonicalRecords)
  records[1].history[1].to = 'closed'

  const report = await auditIncidentRegistry({ policy, records })

  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'invalid-transition'))
  assert.ok(report.errors.some((entry) => entry.code === 'invalid-transition-origin'))
})

test('rejects a record containing a credential-like evidence string', async () => {
  const records = clone(canonicalRecords)
  records[0].reproduction.observed = 'Authorization: Bearer example-token-which-must-never-be-stored'

  const report = await auditIncidentRegistry({ policy, records })

  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'sensitive-data'))
})

test('requires verification and a closure decision for a closed incident', async () => {
  const records = clone(canonicalRecords)
  delete records[0].verification
  delete records[0].closure

  const report = await auditIncidentRegistry({ policy, records })

  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'verification-required'))
  assert.ok(report.errors.some((entry) => entry.code === 'invalid-date' && entry.path === '$.closure.closedAt'))
})

test('rejects duplicated stable identifiers', async () => {
  const records = clone(canonicalRecords)
  records[1].id = records[0].id

  const report = await auditIncidentRegistry({ policy, records })

  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'duplicate-id'))
})
