import { NextResponse } from 'next/server'
import {
  consumeRateLimit,
  getClientIdentifier,
  getRateLimitPolicy,
  rateLimitErrorResponseSchema,
} from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export const rejectExceededAuthRateLimit = (request: Request) => {
  const policy = getRateLimitPolicy(new URL(request.url).pathname)
  const clientIdentifier = getClientIdentifier(request.headers)
  const result = consumeRateLimit(clientIdentifier, policy)

  if (result.allowed) {
    return null
  }

  logger.warn('auth.rate_limit_exceeded', { bucket: policy.bucket })

  return NextResponse.json(
    rateLimitErrorResponseSchema.parse({
      error: 'Trop de requêtes. Veuillez réessayer plus tard.',
      retryAfter: result.retryAfterSeconds,
    }),
    {
      status: 429,
      headers: {
        'Cache-Control': 'no-store',
        'Retry-After': String(result.retryAfterSeconds),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
      },
    }
  )
}
