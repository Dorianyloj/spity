import assert from 'node:assert/strict'
import { test } from 'node:test'
import { auditSupportCollaborations, loadSupportCollaborationPolicy, loadSupportCollaborationRecords } from '../../scripts/check-support-collaborations.mjs'

const clone = (value) => JSON.parse(JSON.stringify(value))
const policy = await loadSupportCollaborationPolicy()
const canonicalRecords = (await loadSupportCollaborationRecords()).records.map(({ record }) => record)

test('accepts the declared support collaboration with a closed controlled simulation', async () => {
  const report = await auditSupportCollaborations({ policy, records: canonicalRecords })
  assert.equal(report.compliant, true)
  assert.equal(report.recordCount, 1)
  assert.equal(report.closedRecordCount, 1)
})

test('rejects a support scenario that hides its simulated nature', async () => {
  const records = clone(canonicalRecords)
  records[0].simulation.disclosure = 'Cas de test.'
  const report = await auditSupportCollaborations({ policy, records })
  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'missing-simulation-disclosure'))
})

test('requires an escalation from support and technical feedback to support', async () => {
  const records = clone(canonicalRecords)
  records[0].handoffs = records[0].handoffs.filter((handoff) => handoff.fromRole !== 'maintainer-l2' || handoff.toRole !== 'support-l1')
  const report = await auditSupportCollaborations({ policy, records })
  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'missing-technical-feedback'))
})

test('rejects a closed case without a successful support validation', async () => {
  const records = clone(canonicalRecords)
  records[0].resolution.supportValidation.status = 'pending'
  const report = await auditSupportCollaborations({ policy, records })
  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'missing-support-validation'))
})

test('rejects a support record that contains a personal email address', async () => {
  const records = clone(canonicalRecords)
  records[0].context.observed = 'Contact de démonstration : pilote@example.test'
  const report = await auditSupportCollaborations({ policy, records })
  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'sensitive-data'))
})

test('rejects an evidence path outside the repository', async () => {
  const records = clone(canonicalRecords)
  records[0].evidence[0].value = '../outside-support-proof.json'
  const report = await auditSupportCollaborations({ policy, records })
  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'reference-outside-repository'))
})
