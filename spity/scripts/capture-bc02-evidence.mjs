import assert from 'node:assert/strict'
import { mkdir, rm, stat, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium, request } from '@playwright/test'

const baseURL = process.env.EVIDENCE_BASE_URL ?? 'http://localhost:3000'
const outputDirectory = resolve('../docs/bc02/annexes/captures')
const password = 'SpityDemo2026!'
const captures = [
  {
    account: 'climber',
    file: '01-dashboard-grimpeur-desktop.png',
    path: '/app',
    viewport: { width: 1440, height: 1000 },
  },
  {
    account: 'climber',
    file: '02-matching-grimpeur-desktop.png',
    path: '/app/matching',
    viewport: { width: 1440, height: 1000 },
  },
  {
    account: 'club',
    file: '03-evenements-club-desktop.png',
    path: '/app/events',
    viewport: { width: 1440, height: 1000 },
  },
  {
    account: 'climber',
    file: '04-profil-grimpeur-mobile.png',
    path: '/profile/me',
    viewport: { width: 390, height: 844 },
  },
]
const accounts = {
  climber: 'lina.demo@spity.local',
  club: 'club.demo@spity.local',
}
const reportCaptures = [
  {
    file: '05-couverture-jest-globale.png',
    path: 'coverage/lcov-report/index.html',
    source: resolve('coverage/lcov-report/index.html'),
    title: 'Rapport de couverture globale Jest',
    viewport: { width: 1000, height: 260 },
  },
  {
    file: '06-recette-playwright.png',
    path: 'playwright-report/index.html',
    source: resolve('playwright-report/index.html'),
    title: 'Rapport de recette Playwright',
    viewport: { width: 1440, height: 1000 },
  },
]

const createStorageState = async (email) => {
  const api = await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      Accept: 'application/json',
      Origin: baseURL,
    },
  })

  try {
    const response = await api.post('/api/auth/login', {
      data: { email, password },
    })
    assert.equal(response.status(), 200, await response.text())

    return api.storageState()
  } finally {
    await api.dispose()
  }
}

await rm(outputDirectory, { recursive: true, force: true })
await mkdir(outputDirectory, { recursive: true })

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

try {
  const storageStates = {
    climber: await createStorageState(accounts.climber),
    club: await createStorageState(accounts.club),
  }
  const results = []

  for (const capture of captures) {
    const context = await browser.newContext({
      storageState: storageStates[capture.account],
      viewport: capture.viewport,
      reducedMotion: 'reduce',
      locale: 'fr-FR',
      timezoneId: 'Europe/Paris',
    })
    const page = await context.newPage()

    await page.goto(`${baseURL}${capture.path}`, { waitUntil: 'networkidle' })
    assert.equal(new URL(page.url()).pathname, capture.path)
    await page.locator('main').waitFor({ state: 'visible' })
    await page.evaluate(() => document.fonts.ready)

    const headingLocator = page.locator('h1, h2').first()
    const heading = await headingLocator.count() > 0
      ? await headingLocator.textContent()
      : await page.title()
    await page.screenshot({
      animations: 'disabled',
      path: resolve(outputDirectory, capture.file),
      fullPage: false,
    })
    results.push({
      account: capture.account,
      file: capture.file,
      heading,
      path: capture.path,
      viewport: capture.viewport,
    })
    await context.close()
  }

  for (const capture of reportCaptures) {
    await stat(capture.source)
    const context = await browser.newContext({
      viewport: capture.viewport,
      locale: 'fr-FR',
      timezoneId: 'Europe/Paris',
    })
    const page = await context.newPage()

    await page.goto(pathToFileURL(capture.source).href, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({
      animations: 'disabled',
      path: resolve(outputDirectory, capture.file),
      fullPage: false,
    })
    results.push({
      file: capture.file,
      source: capture.path,
      title: capture.title,
      viewport: capture.viewport,
    })
    await context.close()
  }

  await writeFile(
    resolve(outputDirectory, 'manifest.json'),
    `${JSON.stringify({ baseURL, generatedAt: new Date().toISOString(), captures: results }, null, 2)}\n`,
  )
  process.stdout.write(`${JSON.stringify({ captures: results.length, outputDirectory })}\n`)
} finally {
  await browser.close()
}
