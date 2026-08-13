import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { evaluateMonitoringWindow } from './evaluate-monitoring-window.mjs'
import { loadMonitoringPolicy } from './run-production-monitor.mjs'

const parseJson = async (path) => JSON.parse(await readFile(path, 'utf8'))

const asDate = (value) => new Date(value)

const completedObservation = (run) => {
  if (run.status !== 'completed' || run.event !== 'schedule') {
    return null
  }

  if (run.conclusion === 'success') {
    return {
      availability: true,
      checkedAt: run.updated_at ?? run.created_at,
      indicators: {},
      source: { runId: run.id, conclusion: run.conclusion, url: run.html_url },
      status: 'healthy',
    }
  }

  if (['failure', 'timed_out', 'action_required'].includes(run.conclusion)) {
    return {
      availability: false,
      checkedAt: run.updated_at ?? run.created_at,
      indicators: {},
      source: { runId: run.id, conclusion: run.conclusion, url: run.html_url },
      status: 'unhealthy',
    }
  }

  return null
}

const githubHeaders = () => ({
  Accept: 'application/vnd.github+json',
  'User-Agent': 'spity-monitoring-slo/1.0',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
})

const fetchWorkflowRuns = async ({ end, fetchImpl = fetch, repository, start }) => {
  const apiUrl = process.env.GITHUB_API_URL ?? 'https://api.github.com'
  const parameters = new URLSearchParams({
    created: `${start.toISOString()}..${end.toISOString()}`,
    exclude_pull_requests: 'true',
    per_page: '100',
    status: 'completed',
  })
  const endpoint = `${apiUrl}/repos/${repository}/actions/workflows/production-monitoring.yml/runs?${parameters}`
  const runs = []

  for (let page = 1; page <= 20; page += 1) {
    const response = await fetchImpl(`${endpoint}&page=${page}`, { headers: githubHeaders() })

    if (!response.ok) {
      throw new Error(`GitHub Actions répond avec le statut ${response.status} lors de la collecte SLO`)
    }

    const payload = await response.json()
    runs.push(...(payload.workflow_runs ?? []))

    if ((payload.workflow_runs ?? []).length < 100) {
      break
    }
  }

  return runs
}

export const captureMonitoringSlo = async ({
  fetchImpl = fetch,
  now = new Date(),
  policy,
  repository = process.env.GITHUB_REPOSITORY ?? 'Dorianyloj/spity',
  runs,
} = {}) => {
  const resolvedPolicy = policy ?? await loadMonitoringPolicy(process.env.MONITORING_POLICY_PATH)
  const evaluatedAt = asDate(now)
  const requestedStart = new Date(evaluatedAt.valueOf() - resolvedPolicy.objectives.availability.windowDays * 24 * 60 * 60 * 1_000)
  const monitoringStart = asDate(resolvedPolicy.monitoringStartedAt)
  const start = monitoringStart > requestedStart ? monitoringStart : requestedStart
  const rawRuns = runs ?? await fetchWorkflowRuns({ end: evaluatedAt, fetchImpl, repository, start })
  const uniqueRuns = [...new Map(rawRuns.map((run) => [run.id, run])).values()]
  const observations = uniqueRuns.map(completedObservation).filter(Boolean)
  const report = evaluateMonitoringWindow({ observations, now: evaluatedAt, policy: resolvedPolicy })

  return {
    ...report,
    criterion: 'C4.1.2',
    policy: {
      schemaVersion: resolvedPolicy.schemaVersion,
      service: resolvedPolicy.service.name,
    },
    source: {
      repository,
      workflow: 'production-monitoring.yml',
      collectedRuns: uniqueRuns.length,
      eligibleScheduledRuns: observations.length,
      excludedRuns: uniqueRuns.length - observations.length,
    },
  }
}

const isMainModule = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMainModule) {
  const policy = await loadMonitoringPolicy(process.env.MONITORING_POLICY_PATH)
  const suppliedPayload = process.env.MONITORING_RUNS_PATH ? await parseJson(process.env.MONITORING_RUNS_PATH) : undefined
  const suppliedRuns = suppliedPayload?.workflow_runs ?? suppliedPayload
  const report = await captureMonitoringSlo({ policy, runs: suppliedRuns })
  const outputPath = resolve(process.env.MONITORING_SLO_OUTPUT_PATH ?? '.monitoring/availability-slo.json')

  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  console.info(JSON.stringify(report, null, 2))

  if (process.env.MONITORING_FAIL_ON_BREACH === 'true' && report.alertable) {
    process.exitCode = 1
  }
}
