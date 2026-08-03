import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.ACCEPTANCE_PORT ?? 3103)
const externalBaseUrl = process.env.ACCEPTANCE_BASE_URL
const localHostname = process.env.CI ? 'localhost' : '127.0.0.1'
const baseURL = externalBaseUrl ?? `http://${localHostname}:${port}`
const webServerCommand = process.env.CI
  ? 'node .next/standalone/server.js'
  : `npm run dev -- --hostname 127.0.0.1 --port ${port}`

export default defineConfig({
  testDir: './tests/acceptance',
  outputDir: 'test-results',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 1,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: '.acceptance-results/results.json' }],
    ['junit', { outputFile: '.acceptance-results/results.xml' }],
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'fr-FR',
    timezoneId: 'Europe/Paris',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: externalBaseUrl ? undefined : {
    command: webServerCommand,
    url: `${baseURL}/api/health`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NEXT_TELEMETRY_DISABLED: '1',
      ...(process.env.CI ? {
        HOSTNAME: '127.0.0.1',
        NODE_ENV: 'production',
        PORT: String(port),
      } : {}),
    },
  },
})
