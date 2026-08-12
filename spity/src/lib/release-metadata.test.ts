export {}

const originalReleaseEnvironment = {
  APP_VERSION: process.env.APP_VERSION,
  APP_REVISION: process.env.APP_REVISION,
  NODE_ENV: process.env.NODE_ENV,
}

const restoreReleaseEnvironment = (name: keyof typeof originalReleaseEnvironment) => {
  const value = originalReleaseEnvironment[name]
  if (value === undefined) {
    delete process.env[name]
    return
  }
  ;(process.env as Record<string, string | undefined>)[name] = value
}

describe('release metadata', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    restoreReleaseEnvironment('APP_VERSION')
    restoreReleaseEnvironment('APP_REVISION')
    restoreReleaseEnvironment('NODE_ENV')
  })

  it('uses explicit image metadata when it is available', async () => {
    process.env.APP_VERSION = '1.2.3'
    process.env.APP_REVISION = 'abc123'

    const { releaseMetadata } = await import('./release-metadata')

    expect(releaseMetadata).toEqual({ version: '1.2.3', revision: 'abc123' })
  })

  it('uses safe local defaults outside production', async () => {
    delete process.env.APP_VERSION
    delete process.env.APP_REVISION
    ;(process.env as Record<string, string | undefined>).NODE_ENV = 'test'

    const { releaseMetadata } = await import('./release-metadata')

    expect(releaseMetadata).toEqual({ version: '0.1.0', revision: 'development' })
  })

  it('never reports a development revision in production', async () => {
    delete process.env.APP_VERSION
    delete process.env.APP_REVISION
    ;(process.env as Record<string, string | undefined>).NODE_ENV = 'production'

    const { releaseMetadata } = await import('./release-metadata')

    expect(releaseMetadata.revision).toBe('unknown')
  })
})
