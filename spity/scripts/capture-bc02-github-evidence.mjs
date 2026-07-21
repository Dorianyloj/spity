import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from '@playwright/test'

const outputDirectory = resolve('../docs/bc02/annexes/github')
const captures = [
  {
    file: '01-historique-commits-develop.png',
    label: 'Historique des commits de la branche develop',
    url: 'https://github.com/Dorianyloj/spity/commits/develop/',
  },
  {
    file: '02-pipeline-ci-global-vert.png',
    label: 'Pipeline CI complet avec staging',
    url: 'https://github.com/Dorianyloj/spity/actions/runs/29828300315',
  },
  {
    file: '03-release-v0.1.0.png',
    label: 'Release stable Spity v0.1.0',
    url: 'https://github.com/Dorianyloj/spity/releases/tag/v0.1.0',
  },
]

await mkdir(outputDirectory, { recursive: true })

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

try {
  const context = await browser.newContext({
    colorScheme: 'light',
    locale: 'fr-FR',
    reducedMotion: 'reduce',
    viewport: { width: 1440, height: 1000 },
  })
  const page = await context.newPage()
  const results = []

  for (const capture of captures) {
    const response = await page.goto(capture.url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
    assert.ok(response?.ok(), `GitHub a répondu ${response?.status()} pour ${capture.url}`)
    await page.locator('main').waitFor({ state: 'visible', timeout: 30_000 })
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({
      animations: 'disabled',
      path: resolve(outputDirectory, capture.file),
      fullPage: false,
    })
    results.push({ ...capture, title: await page.title() })
  }

  await writeFile(
    resolve(outputDirectory, 'manifest.json'),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), captures: results }, null, 2)}\n`,
  )
  process.stdout.write(`${JSON.stringify({ captures: results.length, outputDirectory })}\n`)
} finally {
  await browser.close()
}
