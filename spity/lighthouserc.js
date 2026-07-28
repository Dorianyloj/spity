const numberOfRuns = process.env.CI ? 3 : 1

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start -- --hostname 127.0.0.1 --port 3000',
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 60_000,
      url: [
        'http://127.0.0.1:3000/',
        'http://127.0.0.1:3000/login',
        'http://127.0.0.1:3000/register',
      ],
      numberOfRuns,
      settings: {
        chromeFlags: '--headless --no-sandbox',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
}
