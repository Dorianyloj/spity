type RuntimeEnvironment = 'development' | 'production' | 'test'

export const buildContentSecurityPolicy = (environment: RuntimeEnvironment) => {
  const scriptSources = ["'self'", "'unsafe-inline'"]
  const connectSources = ["'self'"]

  if (environment === 'development') {
    scriptSources.push("'unsafe-eval'")
    connectSources.push('ws:', 'wss:')
  }

  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    `script-src ${scriptSources.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src ${connectSources.join(' ')}`,
    "media-src 'self' blob: https:",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
  ]

  if (environment === 'production') {
    directives.push('upgrade-insecure-requests')
  }

  return directives.join('; ')
}

export const buildSecurityHeaders = (environment: RuntimeEnvironment) => {
  const headers = [
    { key: 'Content-Security-Policy', value: buildContentSecurityPolicy(environment) },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
    { key: 'Origin-Agent-Cluster', value: '?1' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-DNS-Prefetch-Control', value: 'off' },
    { key: 'X-Frame-Options', value: 'DENY' },
  ]

  if (environment === 'production') {
    headers.push({
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    })
  }

  return headers
}
