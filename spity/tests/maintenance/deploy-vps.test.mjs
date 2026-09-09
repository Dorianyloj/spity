import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import { deploy, requirePrivateMode, validateManifest, waitForHealth } from '../../deploy/deploy-vps.mjs'

const require = createRequire(import.meta.url)
const yaml = require('js-yaml')

test('workflow deploys only successful same-repository main pushes and never cancels an active deploy', () => {
  const workflow = yaml.load(readFileSync(new URL('../../../.github/workflows/deploy-production.yml', import.meta.url), 'utf8'))
  assert.deepEqual(workflow.on.workflow_run.branches, ['main'])
  assert.deepEqual(workflow.on.workflow_run.workflows, ['Continuous integration'])
  assert.equal(workflow.concurrency['cancel-in-progress'], false)
  for (const guard of ["conclusion == 'success'", "event == 'push'", "head_branch == 'main'", 'head_repository.full_name == github.repository']) {
    assert.ok(workflow.jobs.images.if.includes(guard))
  }
  assert.equal(workflow.jobs.deploy.environment.name, 'production')
  assert.equal(workflow.jobs.deploy.permissions.packages, 'read')
  const transfer = workflow.jobs.deploy.steps.find((step) => step.name === 'Send release over host-verified SSH').run
  assert.ok(transfer.includes('StrictHostKeyChecking=yes'))
  assert.ok(transfer.includes('IdentitiesOnly=yes'))
  assert.ok(!transfer.includes('ssh-keyscan'))
})

const manifest = {
  revision: 'a'.repeat(40), version: '0.1.0', registryUser: 'Dorianyloj',
  appImage: `ghcr.io/dorianyloj/spity@sha256:${'b'.repeat(64)}`,
  migrationImage: `ghcr.io/dorianyloj/spity-migrations@sha256:${'c'.repeat(64)}`,
}

function fixture(t, failure) {
  const root = mkdtempSync(join(tmpdir(), 'spity-deploy-test-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const incoming = join(root, 'incoming')
  mkdirSync(incoming)
  mkdirSync(join(root, 'automation'))
  const envFile = join(root, '.env.production')
  const oldCompose = join(root, 'old-compose.json')
  writeFileSync(envFile, 'test fixture only', { mode: 0o600 })
  writeFileSync(oldCompose, '{}')
  writeFileSync(join(root, 'automation/production.json'), JSON.stringify({ envFile, appPort: 3100, healthUrl: 'https://spity.example.test/api/health' }))
  writeFileSync(join(incoming, 'manifest.json'), JSON.stringify(manifest))
  writeFileSync(join(incoming, 'registry-token'), 'temporary-test-token')
  writeFileSync(join(incoming, 'docker-compose.production.yml'), 'name: spity-production\n')
  const calls = []
  const healthCalls = []
  const db = { State: { Health: { Status: 'healthy' } }, Mounts: [{ Destination: '/var/lib/mysql', Name: 'spity-production_mariadb_production_data' }] }
  const run = (command, args, options = {}) => {
    calls.push({ command, args })
    assert.equal(command, 'docker')
    if (args[0] === 'inspect') {
      if (args[1].includes('mariadb')) return JSON.stringify([db])
      return JSON.stringify([{
        Image: `sha256:${'d'.repeat(64)}`,
        Config: { Env: ['APP_VERSION=0.0.9', `APP_REVISION=${'e'.repeat(40)}`], Labels: { 'com.docker.compose.project': 'spity-production', 'com.docker.compose.project.config_files': oldCompose } },
      }])
    }
    if (args.includes('config') && args.includes('json')) return JSON.stringify({ services: { app: { image: 'old:tag', build: 'old-source' } } })
    if (args[0] === 'exec') {
      if (failure === 'backup') throw new Error('simulated backup failure')
      writeFileSync(options.stdoutFile, '-- SQL backup fixture\n'.repeat(20))
    }
    if (failure === 'migration' && args.includes('run')) throw new Error('simulated migration failure')
    if (failure === 'start' && args.includes('up') && !args.some((arg) => arg.endsWith('rollback.compose.json'))) throw new Error('simulated app start failure')
    return ''
  }
  const health = async (url, expected) => {
    healthCalls.push({ url, expected })
    if (['health', 'rollback'].includes(failure) && expected.revision === manifest.revision) throw new Error('candidate unhealthy')
    if (failure === 'rollback' && healthCalls.length > 1) throw new Error('rollback unhealthy')
  }
  return {
    root, incoming, calls, healthCalls, db,
    options: {
      root, incoming, run, health, log: () => {}, now: () => new Date('2026-09-09T12:00:00Z'),
      // Windows fixtures have no POSIX modes; the production check is tested below.
      ...(process.platform === 'win32' ? { checkPermissions: () => {} } : {}),
    },
  }
}

test('accepts only this repository image digests and exact commit metadata', () => {
  assert.equal(validateManifest(manifest), manifest)
  for (const patch of [{ appImage: 'ghcr.io/dorianyloj/spity:latest' }, { migrationImage: 'ghcr.io/other/app@sha256:' + 'c'.repeat(64) }, { revision: 'main' }, { version: '0.1.0;echo unsafe' }, { registryUser: '-u someone' }]) {
    assert.throws(() => validateManifest({ ...manifest, ...patch }))
  }
})

test('requires private production credentials', () => {
  assert.doesNotThrow(() => requirePrivateMode(0o100600))
  assert.throws(() => requirePrivateMode(0o100644), /mode 600/)
})

test('health verification retries mismatched commits and rejects redirects', async () => {
  let calls = 0
  await waitForHealth('https://spity.example.test/api/health', manifest, {
    attempts: 2, sleep: async () => {},
    fetchImpl: async (_url, options) => {
      assert.equal(options.redirect, 'error')
      return new Response(JSON.stringify({ status: 'ok', version: manifest.version, revision: ++calls === 1 ? 'old' : manifest.revision }))
    },
  })
  assert.equal(calls, 2)
  await assert.rejects(waitForHealth('https://spity.example.test/api/health', manifest, { attempts: 1, fetchImpl: async () => new Response(JSON.stringify({ status: 'unavailable' }), { status: 503 }) }), /Health check failed/)
})

test('backs up before migration, updates only app, verifies local and public commit, preserves data', async (t) => {
  const f = fixture(t)
  const result = await deploy(f.options)
  assert.equal(result.status, 'deployed')
  assert.ok(f.calls.findIndex(({ args }) => args[0] === 'exec') < f.calls.findIndex(({ args }) => args.includes('run')))
  const start = f.calls.find(({ args }) => args.includes('up'))
  assert.deepEqual(start.args.slice(-7), ['up', '--detach', '--no-deps', '--no-build', '--pull', 'never', 'app'])
  assert.ok(!f.calls.some(({ args }) => args.includes('down') || args.includes('prune') || args.includes('seed-demo')))
  assert.equal(f.healthCalls.length, 3)
  assert.ok(existsSync(result.backup.file))
  assert.equal(readFileSync(`${result.backup.file}.sha256`, 'utf8').trim(), result.backup.sha256)
  assert.equal(JSON.parse(readFileSync(join(f.root, 'current.json'), 'utf8')).revision, manifest.revision)
  assert.ok(!existsSync(join(f.incoming, 'registry-token')))
  const current = JSON.parse(readFileSync(join(f.root, 'current.json'), 'utf8'))
  const rollback = JSON.parse(readFileSync(join(current.releaseDir, 'rollback.compose.json'), 'utf8'))
  assert.equal(rollback.services.app.image, `sha256:${'d'.repeat(64)}`)
  assert.ok(!rollback.services.app.build)
})

for (const failure of ['backup', 'migration']) {
  test(`${failure} failure leaves the existing application untouched`, async (t) => {
    const f = fixture(t, failure)
    await assert.rejects(deploy(f.options), new RegExp(`failed at ${failure}: failed`))
    assert.ok(!f.calls.some(({ args }) => args.includes('up')))
    assert.ok(!existsSync(join(f.root, 'current.json')))
    assert.ok(!existsSync(join(f.incoming, 'registry-token')))
  })
}

for (const failure of ['start', 'health']) {
  test(`${failure} failure rolls back only the app to its exact previous image`, async (t) => {
    const f = fixture(t, failure)
    await assert.rejects(deploy(f.options), /rolled_back/)
    const rollback = f.calls.find(({ args }) => args.includes('up') && args.some((arg) => arg.endsWith('rollback.compose.json')))
    assert.ok(rollback)
    assert.ok(rollback.args.includes('--no-deps'))
    assert.ok(!existsSync(join(f.root, 'current.json')))
    assert.equal(f.calls.filter(({ args }) => args[0] === 'exec').length, 1, 'no automatic database restore')
  })
}

test('rollback failure is explicit, never reported as success', async (t) => {
  const f = fixture(t, 'rollback')
  await assert.rejects(deploy(f.options), /rollback_failed/)
  assert.ok(!existsSync(join(f.root, 'current.json')))
})

test('refuses to create an empty database when the existing volume is missing', async (t) => {
  const f = fixture(t)
  f.db.Mounts = []
  await assert.rejects(deploy(f.options), /Existing Spity database/)
  assert.equal(f.calls.length, 1)
})

test('rejects environment files outside the Spity deployment root', async (t) => {
  const f = fixture(t)
  const outside = mkdtempSync(join(tmpdir(), 'spity-outside-'))
  t.after(() => rmSync(outside, { recursive: true, force: true }))
  const envFile = join(outside, '.env.production')
  writeFileSync(envFile, 'test fixture', { mode: 0o600 })
  writeFileSync(join(f.root, 'automation/production.json'), JSON.stringify({ envFile, appPort: 3100, healthUrl: 'https://spity.example.test/api/health' }))
  await assert.rejects(deploy(f.options), /outside the Spity directory/)
  assert.equal(f.calls.length, 0)
})
