import { createServer } from 'node:http'
import { mkdir, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { verifyDeployment } from './verify-deployment.mjs'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, '../..')
const outputPath = process.env.DEPLOYMENT_EXERCISE_OUTPUT_PATH
  ?? resolve(repositoryRoot, 'docs/rncp/bloc-04/preuves/B4-C422-03-exercice-verification-deploiement-2026-08-13.json')
const expected = {
  revision: 'd'.repeat(40),
  version: '0.1.1-rc.1',
}

const server = createServer((request, response) => {
  response.setHeader('Content-Type', 'application/json')

  if (request.url === '/candidate') {
    response.writeHead(200)
    response.end(JSON.stringify({ status: 'ok', ...expected }))
    return
  }

  if (request.url === '/wrong-version') {
    response.writeHead(200)
    response.end(JSON.stringify({ status: 'ok', revision: expected.revision, version: '0.1.0' }))
    return
  }

  response.writeHead(200)
  response.end(JSON.stringify({ status: 'ok', revision: 'e'.repeat(40), version: expected.version }))
})

await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen))

try {
  const address = server.address()
  const origin = `http://127.0.0.1:${address.port}`
  const options = {
    environment: 'exercise',
    expectedRevision: expected.revision,
    expectedVersion: expected.version,
    retries: 0,
  }
  const acceptedCandidate = await verifyDeployment({ ...options, healthUrl: `${origin}/candidate` })
  const rejectedVersion = await verifyDeployment({ ...options, healthUrl: `${origin}/wrong-version` })
  const rejectedRevision = await verifyDeployment({ ...options, healthUrl: `${origin}/wrong-revision` })
  const passed = acceptedCandidate.result === 'passed'
    && rejectedVersion.result === 'failed'
    && rejectedVersion.health.classification.code === 'version_mismatch'
    && rejectedRevision.result === 'failed'
    && rejectedRevision.health.classification.code === 'revision_mismatch'
  const evidence = {
    schemaVersion: 1,
    criterion: 'C4.2.2',
    executedAt: new Date().toISOString(),
    repositoryRevision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot, encoding: 'utf8' }).trim(),
    safety: 'Local HTTP fixtures only. No production endpoint, Docker daemon, deployment, database or LXC was used.',
    objective: 'Verify that a staged deployment is accepted only when its health endpoint exposes the expected application version and Git revision.',
    result: passed ? 'passed' : 'failed',
    expected,
    cases: {
      acceptedCandidate,
      rejectedRevision,
      rejectedVersion,
    },
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
