import assert from 'node:assert/strict'
import { test } from 'node:test'
import { auditReleaseJournal, loadReleaseJournalPolicy, loadReleaseJournalRecords } from '../../scripts/check-release-journal.mjs'

const clone = (value) => JSON.parse(JSON.stringify(value))
const policy = await loadReleaseJournalPolicy()
const canonicalRecords = (await loadReleaseJournalRecords()).records.map(({ record }) => record)

test('accepts the canonical release journal with one observed production version', async () => {
  const report = await auditReleaseJournal({ policy, records: canonicalRecords })

  assert.equal(report.compliant, true)
  assert.equal(report.recordCount, 3)
  assert.equal(report.deployedRecordCount, 1)
  assert.equal(report.statusCounts['observed-production'], 1)
})

test('rejects a candidate promoted to production without health evidence', async () => {
  const records = clone(canonicalRecords)
  const candidate = records.find((record) => record.id === 'SPITY-REL-2026-0003')
  candidate.status = 'observed-production'
  candidate.history.push({
    at: '2026-08-13T10:00:00.000Z',
    to: 'observed-production',
    actorRole: 'test',
    reason: 'Promotion fictive sans observation.',
  })

  const report = await auditReleaseJournal({ policy, records })

  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'missing-deployment'))
})

test('rejects a deployed correction without its documentation', async () => {
  const records = clone(canonicalRecords)
  const observed = records.find((record) => record.id === 'SPITY-REL-2026-0002')
  observed.changes.corrections[0].documentation = []

  const report = await auditReleaseJournal({ policy, records })

  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'missing-correction-documentation'))
})

test('rejects a production health identity that differs from the journal identity', async () => {
  const records = clone(canonicalRecords)
  const observed = records.find((record) => record.id === 'SPITY-REL-2026-0002')
  observed.deployment.health.revision = 'a'.repeat(40)

  const report = await auditReleaseJournal({ policy, records })

  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'health-revision-mismatch'))
})

test('rejects a release proof path that escapes the repository', async () => {
  const records = clone(canonicalRecords)
  records[0].evidence[0].value = '../outside-release-proof.json'

  const report = await auditReleaseJournal({ policy, records })

  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'reference-outside-repository'))
})

test('requires a candidate or published journal entry for a tagged release version', async () => {
  const report = await auditReleaseJournal({ policy, records: canonicalRecords, expectedReleaseVersion: '0.1.1' })

  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'missing-release-entry'))
})
