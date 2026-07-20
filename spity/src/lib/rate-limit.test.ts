import {
  consumeRateLimit,
  getClientIdentifier,
  getRateLimitPolicy,
  resetRateLimitStoreForTests,
} from './rate-limit'

describe('rate limiting', () => {
  beforeEach(() => {
    resetRateLimitStoreForTests()
  })

  it('applies a stricter policy to login and registration', () => {
    expect(getRateLimitPolicy('/api/auth/login')).toMatchObject({ bucket: 'auth', maxRequests: 10 })
    expect(getRateLimitPolicy('/api/auth/register')).toMatchObject({ bucket: 'auth', maxRequests: 10 })
    expect(getRateLimitPolicy('/api/events')).toMatchObject({ bucket: 'api', maxRequests: 100 })
  })

  it('uses the first proxy address as the client identifier', () => {
    const forwardedHeaders = new Headers({ 'x-forwarded-for': '203.0.113.10, 10.0.0.2' })
    const directHeaders = new Headers({ 'x-real-ip': '198.51.100.4' })

    expect(getClientIdentifier(forwardedHeaders)).toBe('203.0.113.10')
    expect(getClientIdentifier(directHeaders)).toBe('198.51.100.4')
    expect(getClientIdentifier(new Headers())).toBe('unknown')
  })

  it('rejects requests after the configured quota', () => {
    const policy = { bucket: 'auth' as const, maxRequests: 2, windowMs: 60_000 }
    const first = consumeRateLimit('client-a', policy, 1_000)
    const second = consumeRateLimit('client-a', policy, 1_001)
    const rejected = consumeRateLimit('client-a', policy, 1_002)

    expect(first).toMatchObject({ allowed: true, remaining: 1 })
    expect(second).toMatchObject({ allowed: true, remaining: 0 })
    expect(rejected).toMatchObject({ allowed: false, remaining: 0, retryAfterSeconds: 60 })
  })

  it('opens a new window after expiry and isolates buckets', () => {
    const authPolicy = { bucket: 'auth' as const, maxRequests: 1, windowMs: 1_000 }
    const apiPolicy = { bucket: 'api' as const, maxRequests: 1, windowMs: 1_000 }

    expect(consumeRateLimit('client-a', authPolicy, 1_000).allowed).toBe(true)
    expect(consumeRateLimit('client-a', authPolicy, 1_100).allowed).toBe(false)
    expect(consumeRateLimit('client-a', apiPolicy, 1_100).allowed).toBe(true)
    expect(consumeRateLimit('client-a', authPolicy, 2_000).allowed).toBe(true)
  })
})
