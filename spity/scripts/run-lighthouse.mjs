import { spawn, spawnSync } from 'node:child_process'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const port = Number(process.env.LIGHTHOUSE_PORT ?? 3200)
const origin = `http://127.0.0.1:${port}`
const outputDirectory = resolve('.lighthouseci')
const lighthouseCli = resolve('node_modules/lighthouse/cli/index.js')
const standaloneDirectory = resolve('.next/standalone')

const pages = [
  { name: 'home', path: '/' },
  { name: 'login', path: '/login' },
  { name: 'register', path: '/register' },
]

const thresholds = {
  performance: 0.85,
  accessibility: 0.95,
  'best-practices': 0.9,
  seo: 0.9,
}

const waitForServer = async () => {
  const deadline = Date.now() + 30_000

  while (Date.now() < deadline) {
    try {
      const response = await fetch(origin)

      if (response.ok) {
        return
      }
    } catch {
      // The production server may still be starting.
    }

    await new Promise((resolveDelay) => setTimeout(resolveDelay, 250))
  }

  throw new Error(`Le serveur Lighthouse n'est pas disponible sur ${origin}`)
}

const stopServer = (server) => {
  if (!server.killed) {
    server.kill('SIGTERM')
  }
}

await rm(outputDirectory, { recursive: true, force: true })
await mkdir(outputDirectory, { recursive: true })
await cp(resolve('public'), resolve(standaloneDirectory, 'public'), { recursive: true, force: true })
await mkdir(resolve(standaloneDirectory, '.next'), { recursive: true })
await cp(resolve('.next/static'), resolve(standaloneDirectory, '.next/static'), { recursive: true, force: true })

const server = spawn(
  process.execPath,
  [resolve(standaloneDirectory, 'server.js')],
  {
    cwd: standaloneDirectory,
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL ?? 'mysql://lighthouse:lighthouse@127.0.0.1:3306/lighthouse',
      JWT_SECRET: process.env.JWT_SECRET ?? 'lighthouse_only_secret_with_at_least_32_characters',
      NODE_ENV: 'production',
      HOSTNAME: '127.0.0.1',
      PORT: String(port),
    },
    stdio: 'inherit',
  }
)

const stopOnSignal = () => stopServer(server)
process.once('SIGINT', stopOnSignal)
process.once('SIGTERM', stopOnSignal)

try {
  await waitForServer()

  const summary = {}
  const failures = []

  for (const page of pages) {
    const reportPath = resolve(outputDirectory, `${page.name}.json`)
    const result = spawnSync(
      process.execPath,
      [
        lighthouseCli,
        `${origin}${page.path}`,
        '--quiet',
        '--preset=desktop',
        '--only-categories=performance,accessibility,best-practices,seo',
        '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
        '--output=json',
        `--output-path=${reportPath}`,
      ],
      { encoding: 'utf8' }
    )

    if (result.status !== 0) {
      throw new Error(result.stderr || result.stdout || `Lighthouse a échoué pour ${page.path}`)
    }

    const report = JSON.parse(await readFile(reportPath, 'utf8'))
    const scores = Object.fromEntries(
      Object.keys(thresholds).map((category) => [category, report.categories[category].score])
    )

    summary[page.name] = scores

    for (const [category, threshold] of Object.entries(thresholds)) {
      if (scores[category] < threshold) {
        failures.push(`${page.path} ${category}: ${scores[category]} < ${threshold}`)
      }
    }
  }

  await writeFile(
    resolve(outputDirectory, 'summary.json'),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), thresholds, pages: summary }, null, 2)}\n`,
    'utf8'
  )

  console.log(JSON.stringify(summary, null, 2))

  if (failures.length > 0) {
    throw new Error(`Seuils Lighthouse non respectés:\n${failures.join('\n')}`)
  }
} finally {
  stopServer(server)
}
