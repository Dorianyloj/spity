import assert from 'node:assert/strict'
import { test } from 'node:test'
import { auditImprovementBacklog, loadImprovementPolicy, loadImprovementRecords } from '../../scripts/check-improvement-backlog.mjs'

const clone = (value) => JSON.parse(JSON.stringify(value))
const policy = await loadImprovementPolicy()
const canonicalRecords = (await loadImprovementRecords()).records.map(({ record }) => record)

test('accepts the canonical prioritized improvement backlog', async () => {
  const report = await auditImprovementBacklog({ policy, records: canonicalRecords })

  assert.equal(report.compliant, true)
  assert.equal(report.recordCount, 4)
  assert.equal(report.records[0].id, 'SPITY-IMP-2026-0001')
  assert.equal(report.statusCounts.approved, 3)
})

test('rejects a score that does not follow the versioned prioritization formula', async () => {
  const records = clone(canonicalRecords)
  records[0].scoring.score = 99

  const report = await auditImprovementBacklog({ policy, records })

  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'score-mismatch'))
})

test('rejects a priority order that contradicts score and effort', async () => {
  const records = clone(canonicalRecords)
  records[0].priority = 2
  records[1].priority = 1

  const report = await auditImprovementBacklog({ policy, records })

  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'priority-order-mismatch'))
})

test('rejects an indicator without a measurable improvement target', async () => {
  const records = clone(canonicalRecords)
  records[0].indicators[0].target = records[0].indicators[0].baseline

  const report = await auditImprovementBacklog({ policy, records })

  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'invalid-indicator-target'))
})

test('rejects personal data in a feedback input', async () => {
  const records = clone(canonicalRecords)
  records[2].feedbackInputs[0].summary = 'Réponse reçue de pilot@example.com à supprimer.'

  const report = await auditImprovementBacklog({ policy, records })

  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'sensitive-data'))
})

test('rejects a proof path that escapes the repository root', async () => {
  const records = clone(canonicalRecords)
  records[0].evidence[0].value = '../outside-repository.json'

  const report = await auditImprovementBacklog({ policy, records })

  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'evidence-outside-repository'))
})

test('requires a verified outcome before an improvement can be completed', async () => {
  const records = clone(canonicalRecords)
  records[0].status = 'completed'
  records[0].history.push({
    at: '2026-08-13T10:00:00.000+02:00',
    to: 'completed',
    actorRole: 'product-owner',
    reason: 'Test de clôture contrôlé.',
  })

  const report = await auditImprovementBacklog({ policy, records })

  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'outcome-required'))
})
