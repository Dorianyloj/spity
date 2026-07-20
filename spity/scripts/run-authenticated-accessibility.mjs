import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { spawn } from 'node:child_process'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import mysql from 'mysql2/promise'
import puppeteer from 'puppeteer-core'

const port = Number(process.env.ACCESSIBILITY_PORT ?? 3103)
const origin = `http://127.0.0.1:${port}`
const databaseUrl = process.env.DATABASE_URL
const outputDirectory = resolve('.accessibility')
const lighthouseCli = resolve('node_modules/lighthouse/cli/index.js')
const nextBinary = resolve('node_modules/next/dist/bin/next')
const runId = randomUUID().slice(0, 8)
const password = 'Accessibility2026!'
const emails = {
  climber: `accessibility.climber.${runId}@spity.test`,
  club: `accessibility.club.${runId}@spity.test`,
}

let server
let serverOutput = ''

const appendServerOutput = (chunk) => {
  serverOutput = `${serverOutput}${chunk.toString()}`.slice(-30_000)
}

const runCommand = (command, args) => new Promise((resolveCommand, rejectCommand) => {
  const process = spawn(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  let stdout = ''
  let stderr = ''

  process.stdout.on('data', (chunk) => {
    stdout += chunk.toString()
  })
  process.stderr.on('data', (chunk) => {
    stderr += chunk.toString()
  })
  process.once('error', rejectCommand)
  process.once('exit', (code) => {
    if (code === 0) {
      resolveCommand(stdout)
      return
    }

    rejectCommand(new Error(stderr || stdout || `La commande a échoué avec le code ${code}`))
  })
})

const request = async (path, options = {}) => {
  const headers = {
    Accept: 'application/json',
    Origin: origin,
  }

  if (options.cookie) {
    headers.Cookie = options.cookie
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${origin}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })
  const rawBody = await response.text()
  const body = rawBody ? JSON.parse(rawBody) : null

  return { response, body }
}

const waitForServer = async () => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server?.exitCode !== null && server?.exitCode !== undefined) {
      throw new Error(`Le serveur Next.js s'est arrêté avant l'audit.\n${serverOutput}`)
    }

    try {
      const { response, body } = await request('/api/health')

      if (response.status === 200 && body?.status === 'ok') {
        return
      }
    } catch {
      // Next.js ou MariaDB peut encore être en cours de démarrage.
    }

    await delay(500)
  }

  throw new Error(`Le serveur d'accessibilité n'est pas prêt après 30 secondes.\n${serverOutput}`)
}

const stopServer = async () => {
  if (!server || server.exitCode !== null) {
    return
  }

  server.kill('SIGTERM')
  await Promise.race([
    new Promise((resolveExit) => server.once('exit', resolveExit)),
    delay(5_000),
  ])

  if (server.exitCode === null) {
    server.kill('SIGKILL')
  }
}

const cleanupDatabase = async () => {
  if (!databaseUrl) {
    return
  }

  const connection = await mysql.createConnection(databaseUrl)

  try {
    await connection.execute('delete from users where email in (?, ?)', [emails.climber, emails.club])
  } finally {
    await connection.end()
  }
}

const register = async (email, role) => {
  const { response, body } = await request('/api/auth/register', {
    method: 'POST',
    body: { email, password, role },
  })

  assert.equal(response.status, 201, JSON.stringify(body))
  const setCookie = response.headers.get('set-cookie')
  assert.ok(setCookie, 'Le cookie de session doit être défini')

  return setCookie.split(';')[0]
}

const createProfiles = async () => {
  const climberCookie = await register(emails.climber, 'grimpeur')
  const clubCookie = await register(emails.club, 'club')
  const climberProfile = await request('/api/profile/grimpeur', {
    method: 'POST',
    cookie: climberCookie,
    body: {
      disciplines: ['bloc'],
      niveaux: { bloc: '6a' },
      materiel: ['chaussons'],
    },
  })
  assert.equal(climberProfile.response.status, 201, JSON.stringify(climberProfile.body))

  const publicProfile = await request('/api/profile/public', {
    method: 'PATCH',
    cookie: climberCookie,
    body: {
      avatarUrl: null,
      displayName: 'Audit Accessibilité',
      bio: 'Profil temporaire dédié au contrôle automatisé.',
      location: 'Lyon',
      climbingEnvironment: 'mixed',
      availability: ['weekend_morning'],
      partnerSearch: {
        enabled: true,
        levelPreference: 'same_or_close',
        style: 'training',
        notes: null,
      },
      goals: ['Trouver des partenaires réguliers'],
    },
  })
  assert.equal(publicProfile.response.status, 200, JSON.stringify(publicProfile.body))

  const clubProfile = await request('/api/profile/club', {
    method: 'POST',
    cookie: clubCookie,
    body: {
      nom: 'Club Audit Accessibilité',
      bio: 'Profil temporaire dédié au contrôle automatisé.',
      location: 'Lyon',
      ffmeNum: 'AUDIT-RGAA',
    },
  })
  assert.equal(clubProfile.response.status, 201, JSON.stringify(clubProfile.body))

  return { climberCookie, clubCookie }
}

const runInteractionChecks = async (climberCookie) => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH ?? '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  })

  try {
    const publicPage = await browser.newPage()
    await publicPage.setViewport({ width: 1280, height: 800 })
    await publicPage.goto(`${origin}/login`, { waitUntil: 'domcontentloaded' })
    await publicPage.keyboard.press('Tab')

    const firstFocusedText = await publicPage.evaluate(() => document.activeElement?.textContent?.trim())
    assert.equal(firstFocusedText, 'Aller au contenu principal')

    await publicPage.keyboard.press('Enter')
    await publicPage.waitForFunction(
      () => document.activeElement?.id === 'contenu-principal',
      { timeout: 2_000 }
    )
    const skipTarget = await publicPage.evaluate(() => document.activeElement?.id)
    assert.equal(skipTarget, 'contenu-principal')

    await publicPage.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    const reducedMotionScrollBehavior = await publicPage.evaluate(() => {
      return getComputedStyle(document.documentElement).scrollBehavior
    })
    assert.equal(reducedMotionScrollBehavior, 'auto')

    const authenticatedPage = await browser.newPage()
    const separatorIndex = climberCookie.indexOf('=')
    const cookieName = climberCookie.slice(0, separatorIndex)
    const cookieValue = climberCookie.slice(separatorIndex + 1)
    await authenticatedPage.setCookie({
      name: cookieName,
      value: cookieValue,
      url: origin,
      httpOnly: true,
      sameSite: 'Lax',
    })
    await authenticatedPage.setViewport({ width: 360, height: 800, deviceScaleFactor: 1 })

    const mobileChecks = {}

    for (const page of [
      { name: 'dashboard', path: '/app' },
      { name: 'profile', path: '/profile/me' },
    ]) {
      await authenticatedPage.goto(`${origin}${page.path}`, { waitUntil: 'domcontentloaded' })
      await delay(500)
      mobileChecks[page.name] = await authenticatedPage.evaluate(() => {
        const viewportWidth = document.documentElement.clientWidth
        const overflowElements = Array.from(document.querySelectorAll('body *'))
          .filter((element) => {
            const bounds = element.getBoundingClientRect()
            let ancestor = element.parentElement

            while (ancestor && ancestor !== document.body) {
              const overflowX = getComputedStyle(ancestor).overflowX

              if (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'hidden') {
                return false
              }

              ancestor = ancestor.parentElement
            }

            return bounds.right > viewportWidth + 1 || bounds.left < -1
          })
          .slice(0, 10)
          .map((element) => {
            const bounds = element.getBoundingClientRect()

            return {
              className: element.className?.toString().slice(0, 160) ?? '',
              left: Math.round(bounds.left),
              right: Math.round(bounds.right),
              tagName: element.tagName,
            }
          })

        return {
          passed: document.documentElement.scrollWidth <= viewportWidth,
          viewportWidth,
          scrollWidth: document.documentElement.scrollWidth,
          overflowElements,
        }
      })
      assert.equal(
        mobileChecks[page.name].passed,
        true,
        `${page.path} ne doit pas créer de défilement horizontal: ${JSON.stringify(mobileChecks[page.name])}`
      )
      await authenticatedPage.screenshot({
        path: resolve(outputDirectory, `${page.name}-mobile.png`),
        fullPage: true,
      })
    }

    return {
      skipLink: true,
      reducedMotion: true,
      mobileReflow: mobileChecks,
    }
  } finally {
    await browser.close()
  }
}

const auditPage = async (page) => {
  const reportPath = resolve(outputDirectory, `${page.name}.json`)
  const extraHeaders = JSON.stringify({ Cookie: page.cookie })

  const viewportArguments = page.mobile
    ? ['--screenEmulation.width=360', '--screenEmulation.height=800', '--screenEmulation.deviceScaleFactor=1']
    : ['--preset=desktop']

  await runCommand(process.execPath, [
    lighthouseCli,
    `${origin}${page.path}`,
    '--quiet',
    ...viewportArguments,
    '--only-categories=accessibility',
    '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
    `--extra-headers=${extraHeaders}`,
    '--output=json',
    `--output-path=${reportPath}`,
  ])

  const report = JSON.parse(await readFile(reportPath, 'utf8'))

  return report.categories.accessibility.score
}

assert.ok(databaseUrl, 'DATABASE_URL est requis pour l’audit authentifié')
await rm(outputDirectory, { recursive: true, force: true })
await mkdir(outputDirectory, { recursive: true })
await cleanupDatabase()

server = spawn(process.execPath, [nextBinary, 'dev', '--hostname', '127.0.0.1', '--port', String(port)], {
  cwd: resolve('.'),
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: '1',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
})
server.stdout.on('data', appendServerOutput)
server.stderr.on('data', appendServerOutput)

try {
  await waitForServer()
  const { climberCookie, clubCookie } = await createProfiles()
  const interactionChecks = await runInteractionChecks(climberCookie)
  const pages = [
    { name: 'dashboard-grimpeur', path: '/app', cookie: climberCookie },
    { name: 'matching-grimpeur', path: '/app/matching', cookie: climberCookie },
    { name: 'demandes-grimpeur', path: '/app/partnerships', cookie: climberCookie },
    { name: 'lieux-grimpeur', path: '/app/places', cookie: climberCookie },
    { name: 'evenements-grimpeur', path: '/app/events', cookie: climberCookie },
    { name: 'profil-grimpeur', path: '/profile/me', cookie: climberCookie },
    { name: 'evenements-club', path: '/app/events', cookie: clubCookie },
    { name: 'profil-club', path: '/profile/me', cookie: clubCookie },
    { name: 'dashboard-grimpeur-mobile', path: '/app', cookie: climberCookie, mobile: true },
    { name: 'profil-grimpeur-mobile', path: '/profile/me', cookie: climberCookie, mobile: true },
  ]
  const scores = {}

  for (const page of pages) {
    scores[page.name] = await auditPage(page)
  }

  const failures = Object.entries(scores)
    .filter(([, score]) => score !== 1)
    .map(([name, score]) => `${name}: ${score}`)
  const summary = {
    generatedAt: new Date().toISOString(),
    threshold: 1,
    pages: scores,
    interactionChecks,
  }

  await writeFile(resolve(outputDirectory, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8')
  console.info(JSON.stringify(summary, null, 2))

  if (failures.length > 0) {
    throw new Error(`Scores d'accessibilité inférieurs à 100 %:\n${failures.join('\n')}`)
  }
} finally {
  try {
    await cleanupDatabase()
  } finally {
    await stopServer()
  }
}
