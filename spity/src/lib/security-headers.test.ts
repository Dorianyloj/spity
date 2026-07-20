import { buildContentSecurityPolicy, buildSecurityHeaders } from './security-headers'

describe('security headers', () => {
  it('builds a restrictive production CSP', () => {
    const policy = buildContentSecurityPolicy('production')

    expect(policy).toContain("default-src 'self'")
    expect(policy).toContain("object-src 'none'")
    expect(policy).toContain("frame-ancestors 'none'")
    expect(policy).toContain("form-action 'self'")
    expect(policy).toContain('upgrade-insecure-requests')
    expect(policy).not.toContain("'unsafe-eval'")
  })

  it('allows the development websocket and source evaluation required by Next.js HMR', () => {
    const policy = buildContentSecurityPolicy('development')

    expect(policy).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval'")
    expect(policy).toContain("connect-src 'self' ws: wss:")
    expect(policy).not.toContain('upgrade-insecure-requests')
  })

  it('only enables HSTS in production', () => {
    const productionHeaders = buildSecurityHeaders('production')
    const developmentHeaders = buildSecurityHeaders('development')

    expect(productionHeaders).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'Strict-Transport-Security' }),
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
    ]))
    expect(developmentHeaders).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'Strict-Transport-Security' }),
    ]))
  })
})
