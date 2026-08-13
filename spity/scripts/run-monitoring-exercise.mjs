import { execFileSync } from 'node:child_process'
import { createServer } from 'node:http'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkHealth } from './check-health.mjs'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, '../..')
const outputPath = resolve(
  process.env.BLOC4_EXERCISE_OUTPUT
    ?? resolve(repositoryRoot, 'docs/rncp/bloc-04/preuves/B4-C412-03-exercice-alerte-2026-08-13.json')
)

const server = createServer((request, response) => {
  response.setHeader('Content-Type', 'application/json')

  if (request.url === '/healthy') {
    response.writeHead(200)
    response.end(JSON.stringify({ status: 'ok', version: 'monitoring-exercise', revision: 'c'.repeat(40) }))
    return
  }

  response.writeHead(503)
  response.end(JSON.stringify({ status: 'degraded', version: 'monitoring-exercise', revision: 'c'.repeat(40) }))
})

await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen))

try {
  const address = server.address()
  const origin = `http://127.0.0.1:${address.port}`
  const healthy = await checkHealth({ url: `${origin}/healthy`, retries: 0 })
  const degraded = await checkHealth({ url: `${origin}/degraded`, retries: 1, retryDelayMs: 10 })
  const passed = healthy.status === 'healthy'
    && degraded.status === 'unhealthy'
    && degraded.attempts.length === 2

  const evidence = {
    schemaVersion: 1,
    type: 'controlled-monitoring-exercise',
    executedAt: new Date().toISOString(),
    criteria: ['C4.1.2', 'C4.2.1'],
    repositoryRevision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot, encoding: 'utf8' }).trim(),
    safety: 'Local HTTP fixture only. No production request was degraded and no customer data was used.',
    objective: 'Verify that a healthy payload passes and that an HTTP/application failure produces a retryable, actionable alert report.',
    expectedOutcome: 'The healthy probe succeeds. The degraded probe fails after two attempts with a non-zero CLI-compatible status.',
    result: passed ? 'passed' : 'failed',
    healthyProbe: healthy,
    degradedProbe: degraded,
  }

  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8')
  console.info(JSON.stringify(evidence, null, 2))

  if (!passed) {
    process.exitCode = 1
  }
} finally {
  await new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()))
}
