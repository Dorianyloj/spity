import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { closeSync, copyFileSync, createReadStream, mkdirSync, openSync, readFileSync, realpathSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const project = 'spity-production'
const appContainer = `${project}-app-1`
const dbContainer = `${project}-mariadb-1`

export function validateManifest(manifest) {
  if (!/^[a-f0-9]{40}$/.test(manifest.revision ?? '')) throw new Error('Invalid commit SHA')
  if (!/^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?$/.test(manifest.version ?? '')) throw new Error('Invalid version')
  for (const [key, image] of [['appImage', 'spity'], ['migrationImage', 'spity-migrations']]) {
    if (!new RegExp(`^ghcr\\.io/dorianyloj/${image}@sha256:[a-f0-9]{64}$`).test(manifest[key] ?? '')) {
      throw new Error(`Invalid immutable ${key}`)
    }
  }
  if (!/^[a-zA-Z0-9-]+$/.test(manifest.registryUser ?? '')) throw new Error('Invalid registry user')
  return manifest
}

function privateJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 })
}

function inside(root, path) {
  const rel = relative(realpathSync(root), realpathSync(path))
  if (!rel || rel.startsWith('..') || isAbsolute(rel)) throw new Error('Deployment path is outside the Spity directory')
  return path
}

export function requirePrivateMode(mode) {
  if ((mode & 0o077) !== 0) throw new Error('Production env file must have mode 600')
}

// Never print child output/errors: resolved Compose configuration, dumps and
// migration exceptions can contain production credentials or personal data.
export function runCommand(command, args, options = {}) {
  let descriptor
  try {
    if (options.stdoutFile) descriptor = openSync(options.stdoutFile, 'wx', 0o600)
    return execFileSync(command, args, {
      encoding: 'utf8', timeout: 180_000, maxBuffer: 16 * 1024 * 1024,
      stdio: ['pipe', descriptor ?? 'pipe', 'pipe'],
      input: options.input,
    }) ?? ''
  } catch {
    throw new Error(`${command} ${args[0] ?? ''} failed (sensitive output withheld)`)
  } finally {
    if (descriptor !== undefined) closeSync(descriptor)
  }
}

export async function waitForHealth(url, expected, { fetchImpl = fetch, sleep = (ms) => new Promise((done) => setTimeout(done, ms)), attempts = 40 } = {}) {
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const response = await fetchImpl(url, { signal: AbortSignal.timeout(5000), redirect: 'error', cache: 'no-store' })
      const health = await response.json()
      if (response.ok && health.status === 'ok' && health.revision === expected.revision && health.version === expected.version) return
    } catch { /* Starting container or transient network failure: retry. */ }
    if (attempt + 1 < attempts) await sleep(3000)
  }
  throw new Error('Health check failed or version/commit mismatch')
}

export async function deploy({ root, incoming, run = runCommand, health = waitForHealth, log = console.log, now = () => new Date(), checkPermissions = (path) => requirePrivateMode(statSync(path).mode) }) {
  root = realpathSync(root)
  inside(root, incoming)
  const config = JSON.parse(readFileSync(join(root, 'automation/production.json'), 'utf8'))
  const manifest = validateManifest(JSON.parse(readFileSync(join(incoming, 'manifest.json'), 'utf8')))
  const envFile = inside(root, config.envFile)
  checkPermissions(envFile)
  if (!/^https:\/\/[^/?#]+\/api\/health$/.test(config.healthUrl)) throw new Error('An HTTPS health URL is required')
  if (!Number.isInteger(config.appPort) || config.appPort < 1024 || config.appPort > 65535) throw new Error('Invalid application port')

  // Refuse to bootstrap a new/empty database or accidentally operate another app.
  const inspect = (name) => JSON.parse(run('docker', ['inspect', name]))[0]
  const db = inspect(dbContainer)
  if (db.State?.Health?.Status !== 'healthy' || !db.Mounts?.some((mount) => mount.Destination === '/var/lib/mysql' && mount.Name === `${project}_mariadb_production_data`)) {
    throw new Error('Existing Spity database/volume is missing or unhealthy; manual investigation required')
  }
  const previousApp = inspect(appContainer)
  if (previousApp.Config?.Labels?.['com.docker.compose.project'] !== project) throw new Error('Unexpected application project')
  const previousFiles = previousApp.Config.Labels['com.docker.compose.project.config_files'].split(',').map((path) => inside(root, path))
  const previousEnv = previousApp.Config.Env ?? []
  const previous = Object.fromEntries(previousEnv.filter((line) => /^(APP_VERSION|APP_REVISION)=/.test(line)).map((line) => {
    const index = line.indexOf('=')
    return [line.slice(0, index), line.slice(index + 1)]
  }))
  const previousMetadata = { version: previous.APP_VERSION, revision: previous.APP_REVISION }
  if (!previousMetadata.version || !previousMetadata.revision || !/^sha256:[a-f0-9]{64}$/.test(previousApp.Image)) throw new Error('Previous release cannot be identified for rollback')
  await health(`http://127.0.0.1:${config.appPort}/api/health`, previousMetadata)

  const releaseId = `${now().toISOString().replace(/[:.]/g, '-')}-${manifest.revision.slice(0, 12)}`
  const releaseDir = join(root, 'releases', releaseId)
  const backupDir = join(root, 'backups')
  mkdirSync(releaseDir, { recursive: true, mode: 0o700 })
  mkdirSync(backupDir, { recursive: true, mode: 0o700 })
  const composeFile = join(releaseDir, 'docker-compose.production.yml')
  const overrideFile = join(releaseDir, 'images.json')
  const rollbackFile = join(releaseDir, 'rollback.compose.json')
  const reportFile = join(releaseDir, 'deployment.json')
  const backupFile = join(backupDir, `${releaseId}.sql`)
  copyFileSync(join(incoming, 'docker-compose.production.yml'), composeFile)
  privateJson(join(releaseDir, 'manifest.json'), manifest)
  privateJson(overrideFile, { services: {
    app: { image: manifest.appImage, environment: { APP_VERSION: manifest.version, APP_REVISION: manifest.revision } },
    migrate: { image: manifest.migrationImage },
  } })
  const compose = ['compose', '--project-name', project, '--env-file', envFile, '-f', composeFile, '-f', overrideFile]
  const previousConfig = JSON.parse(run('docker', ['compose', '--project-name', project, '--env-file', envFile, ...previousFiles.flatMap((path) => ['-f', path]), 'config', '--format', 'json']))
  previousConfig.services.app.image = previousApp.Image
  delete previousConfig.services.app.build
  privateJson(rollbackFile, previousConfig)
  // Protect the exact rollback image from dangling-image cleanup.
  run('docker', ['image', 'tag', previousApp.Image, `spity-rollback:${releaseId.toLowerCase()}`])

  const report = { revision: manifest.revision, version: manifest.version, previous: previousMetadata, startedAt: now().toISOString(), status: 'preparing' }
  const saveReport = () => privateJson(reportFile, report)
  saveReport()
  let replacingApp = false
  let stage = 'prepare'
  try {
    run('docker', [...compose, 'config', '--quiet'])
    stage = 'pull'
    const tokenFile = join(incoming, 'registry-token')
    try {
      run('docker', ['login', 'ghcr.io', '--username', manifest.registryUser, '--password-stdin'], { input: readFileSync(tokenFile, 'utf8') })
    } finally {
      rmSync(tokenFile, { force: true })
    }
    run('docker', [...compose, 'pull', 'app', 'migrate'])
    stage = 'backup'
    log('Saving the existing database before migrations.')
    run('docker', ['exec', dbContainer, 'sh', '-c', 'exec mariadb-dump --single-transaction --quick --routines --triggers --events -uroot -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE"'], { stdoutFile: backupFile })
    if (statSync(backupFile).size < 100) throw new Error('Database backup is empty')
    // The backup stays on the VPS (mode 600), never in a GitHub artifact.
    const hash = createHash('sha256')
    for await (const chunk of createReadStream(backupFile)) hash.update(chunk)
    const backupHash = hash.digest('hex')
    writeFileSync(`${backupFile}.sha256`, `${backupHash}\n`, { mode: 0o600 })
    report.backup = { file: backupFile, sha256: backupHash }
    saveReport()
    stage = 'migration'
    log('Applying database migrations; no seed or database reset.')
    run('docker', [...compose, 'run', '--rm', '--no-deps', 'migrate'])
    stage = 'application'
    replacingApp = true
    run('docker', [...compose, 'up', '--detach', '--no-deps', '--no-build', '--pull', 'never', 'app'])
    stage = 'health'
    const expected = { version: manifest.version, revision: manifest.revision }
    await health(`http://127.0.0.1:${config.appPort}/api/health`, expected)
    await health(config.healthUrl, expected)
    report.status = 'deployed'
    report.finishedAt = now().toISOString()
    saveReport()
    const currentTemp = join(root, 'current.json.tmp')
    privateJson(currentTemp, { releaseDir, ...manifest })
    renameSync(currentTemp, join(root, 'current.json'))
    log(`Spity deployed: ${manifest.revision}`)
    return report
  } catch {
    report.status = 'failed'
    report.failedStage = stage
    if (replacingApp) {
      log('Deployment failed; restoring the previous application image (database unchanged).')
      try {
        run('docker', ['compose', '--project-name', project, '-f', rollbackFile, 'up', '--detach', '--no-deps', '--no-build', '--pull', 'never', 'app'])
        await health(`http://127.0.0.1:${config.appPort}/api/health`, previousMetadata)
        await health(config.healthUrl, previousMetadata)
        report.status = 'rolled_back'
      } catch {
        report.status = 'rollback_failed'
      }
    }
    report.finishedAt = now().toISOString()
    saveReport()
    throw new Error(`Deployment failed at ${stage}: ${report.status}. Inspect ${reportFile}; no automatic database restore was performed.`)
  } finally {
    rmSync(join(incoming, 'registry-token'), { force: true })
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [root, incoming] = process.argv.slice(2)
  if (!root || !incoming) throw new Error('Usage: node deploy-vps.mjs ROOT INCOMING')
  await deploy({ root, incoming }).catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
