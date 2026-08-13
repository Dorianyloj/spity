import assert from 'node:assert/strict'
import { test } from 'node:test'
import { captureMonitoringSlo } from '../../scripts/capture-monitoring-slo.mjs'
import { evaluateMonitoringWindow } from '../../scripts/evaluate-monitoring-window.mjs'

const policy = {
  monitoringStartedAt: '2026-01-01T00:00:00.000Z',
  probe: { intervalMinutes: 15 },
  service: { name: 'Spity' },
  objectives: {
    availability: {
      windowDays: 1,
      targetPercent: 99.5,
      minimumCoveragePercent: 95,
      minimumObservedSamples: 96,
    },
    latency: { thresholdMs: 3_000 },
  },
}
const now = new Date('2026-01-02T00:00:00.000Z')
const start = new Date('2026-01-01T00:00:00.000Z')

const observations = (unavailableIndexes = []) => Array.from({ length: 97 }, (_, index) => ({
  availability: !unavailableIndexes.includes(index),
  checkedAt: new Date(start.valueOf() + index * 15 * 60 * 1_000).toISOString(),
  indicators: { latencyMs: 120 + index },
  status: unavailableIndexes.includes(index) ? 'unhealthy' : 'healthy',
}))

test('declares a covered 30-day-style availability objective compliant', () => {
  const report = evaluateMonitoringWindow({ observations: observations(), now, policy })

  assert.equal(report.status, 'compliant')
  assert.equal(report.alertable, false)
  assert.equal(report.availability.coveragePercent, 100)
  assert.equal(report.availability.measuredPercent, 100)
  assert.equal(report.latency.p95Ms, 212)
})

test('alerts only for a target breach with sufficient coverage', () => {
  const report = evaluateMonitoringWindow({ observations: observations([40]), now, policy })

  assert.equal(report.status, 'breach')
  assert.equal(report.alertable, true)
  assert.equal(report.availability.measuredPercent, 98.969)
})

test('does not alert from an incomplete monitoring window', () => {
  const report = evaluateMonitoringWindow({ observations: observations().slice(0, 20), now, policy })

  assert.equal(report.status, 'insufficient-data')
  assert.equal(report.alertable, false)
  assert.equal(report.availability.ready, false)
})

test('uses scheduled GitHub workflow runs and excludes manual exercises from the SLO', async () => {
  const runs = observations().map((observation, index) => ({
    conclusion: 'success',
    created_at: observation.checkedAt,
    event: 'schedule',
    html_url: `https://example.test/runs/${index}`,
    id: index,
    status: 'completed',
    updated_at: observation.checkedAt,
  }))
  runs.push({
    conclusion: 'failure',
    created_at: now.toISOString(),
    event: 'workflow_dispatch',
    html_url: 'https://example.test/runs/manual',
    id: 999,
    status: 'completed',
    updated_at: now.toISOString(),
  })

  const report = await captureMonitoringSlo({ now, policy, repository: 'owner/repository', runs })

  assert.equal(report.status, 'compliant')
  assert.equal(report.source.eligibleScheduledRuns, 97)
  assert.equal(report.source.excludedRuns, 1)
})
