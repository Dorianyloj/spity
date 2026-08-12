import { logger } from './logger'

const originalNodeEnvironment = process.env.NODE_ENV

describe('logger', () => {
  afterEach(() => {
    ;(process.env as Record<string, string | undefined>).NODE_ENV = originalNodeEnvironment
    jest.restoreAllMocks()
  })

  it('does not write logs while tests are running', () => {
    const info = jest.spyOn(console, 'info').mockImplementation()

    logger.info('test.silent')

    expect(info).not.toHaveBeenCalled()
  })

  it('writes structured entries at each supported level', () => {
    ;(process.env as Record<string, string | undefined>).NODE_ENV = 'production'
    const error = jest.spyOn(console, 'error').mockImplementation()
    const warn = jest.spyOn(console, 'warn').mockImplementation()
    const info = jest.spyOn(console, 'info').mockImplementation()

    logger.error('incident.failed', { incidentId: 42 })
    logger.warn('incident.degraded')
    logger.info('incident.recovered', { durationMs: 1250 })

    expect(JSON.parse(String(error.mock.calls[0][0]))).toEqual(expect.objectContaining({
      level: 'error',
      event: 'incident.failed',
      incidentId: 42,
    }))
    expect(JSON.parse(String(warn.mock.calls[0][0]))).toEqual(expect.objectContaining({
      level: 'warn',
      event: 'incident.degraded',
    }))
    expect(JSON.parse(String(info.mock.calls[0][0]))).toEqual(expect.objectContaining({
      level: 'info',
      event: 'incident.recovered',
      durationMs: 1250,
      timestamp: expect.any(String),
    }))
  })
})
