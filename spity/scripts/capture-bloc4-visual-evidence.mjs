import assert from 'node:assert/strict'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium, request } from '@playwright/test'

const baseURL = process.env.EVIDENCE_BASE_URL ?? 'http://127.0.0.1:3000'
const outputDirectory = resolve('../docs/rncp/bloc-04/preuves/captures')
const password = 'SpityDemo2026!'

const accounts = {
  climber: 'lina.demo@spity.local',
  club: 'club.demo@spity.local',
}

const captures = [
  {
    id: 'B4-VIS-01',
    label: 'Accueil public Spity',
    file: 'B4-VIS-01-accueil-public-spity-2026-08-13.png',
    path: '/',
    viewport: { width: 1440, height: 1000 },
  },
  {
    id: 'B4-VIS-02',
    label: 'Tableau de bord grimpeur authentifié',
    account: 'climber',
    file: 'B4-VIS-02-tableau-de-bord-grimpeur-2026-08-13.png',
    path: '/app',
    viewport: { width: 1440, height: 1000 },
  },
  {
    id: 'B4-VIS-03',
    label: 'Matching de partenaires grimpeur',
    account: 'climber',
    file: 'B4-VIS-03-matching-grimpeur-2026-08-13.png',
    path: '/app/matching',
    viewport: { width: 1440, height: 1000 },
  },
  {
    id: 'B4-VIS-04',
    label: 'Gestion des événements par un club',
    account: 'club',
    file: 'B4-VIS-04-evenements-club-2026-08-13.png',
    path: '/app/events',
    viewport: { width: 1440, height: 1000 },
  },
  {
    id: 'B4-VIS-05',
    label: 'Profil grimpeur sur viewport mobile',
    account: 'climber',
    file: 'B4-VIS-05-profil-grimpeur-mobile-2026-08-13.png',
    path: '/profile/me',
    viewport: { width: 390, height: 844 },
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

await mkdir(outputDirectory, { recursive: true })

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? chromium.executablePath(),
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
      ...(capture.account ? { storageState: storageStates[capture.account] } : {}),
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
    await page.screenshot({
      animations: 'disabled',
      path: resolve(outputDirectory, capture.file),
      fullPage: false,
    })

    const imagePath = resolve(outputDirectory, capture.file)
    const image = await stat(imagePath)
    assert.ok(image.size > 0, `Capture vide : ${capture.file}`)

    results.push({
      id: capture.id,
      label: capture.label,
      accountType: capture.account ?? 'public',
      path: capture.path,
      file: capture.file,
      viewport: capture.viewport,
      byteSize: image.size,
    })
    await context.close()
  }

  await writeFile(
    resolve(outputDirectory, 'manifest.json'),
    `${JSON.stringify({
      schemaVersion: 1,
      capturedAt: new Date().toISOString(),
      source: 'local-demo',
      baseURL,
      sensitiveData: 'Aucune donnée personnelle ou secret n’est inclus dans les captures.',
      captures: results,
    }, null, 2)}\n`,
  )

  process.stdout.write(`${JSON.stringify({ captures: results.length, outputDirectory })}\n`)
} finally {
  await browser.close()
}
