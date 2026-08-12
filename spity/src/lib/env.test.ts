export {}

const originalEnvironment = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NEXT_PHASE: process.env.NEXT_PHASE,
}

const restoreEnvironment = (name: keyof typeof originalEnvironment) => {
  const value = originalEnvironment[name]
  if (value === undefined) {
    delete process.env[name]
    return
  }
  process.env[name] = value
}

describe('environment configuration', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    restoreEnvironment('DATABASE_URL')
    restoreEnvironment('JWT_SECRET')
    restoreEnvironment('NEXT_PHASE')
  })

  it('parses an explicitly configured runtime environment', async () => {
    delete process.env.NEXT_PHASE
    process.env.DATABASE_URL = 'mysql://spity:password@localhost:3306/spity'
    process.env.JWT_SECRET = 'a_runtime_secret_with_at_least_32_characters'

    const { env } = await import('./env')

    expect(env.DATABASE_URL).toBe('mysql://spity:password@localhost:3306/spity')
    expect(env.JWT_SECRET).toBe('a_runtime_secret_with_at_least_32_characters')
    expect(env.NODE_ENV).toBe('test')
  })

  it('uses isolated placeholders while Next.js collects production pages', async () => {
    process.env.NEXT_PHASE = 'phase-production-build'
    delete process.env.DATABASE_URL
    delete process.env.JWT_SECRET

    const { env } = await import('./env')

    expect(env.DATABASE_URL).toBe('mysql://build:build@127.0.0.1:3306/build')
    expect(env.JWT_SECRET).toBe('build_only_secret_with_at_least_32_characters')
  })

  it('rejects an invalid runtime configuration', async () => {
    delete process.env.NEXT_PHASE
    process.env.DATABASE_URL = 'postgres://localhost/spity'
    process.env.JWT_SECRET = 'too-short'

    await expect(import('./env')).rejects.toThrow('Configuration d\'environnement invalide')
  })
})
