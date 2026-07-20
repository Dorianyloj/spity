import { z } from 'zod'

export type RateLimitPolicy = {
  bucket: 'auth' | 'api'
  maxRequests: number
  windowMs: number
}

type RateLimitRecord = {
  count: number
  resetAt: number
}

export type RateLimitResult = {
  allowed: boolean
  limit: number
  remaining: number
  resetAt: number
  retryAfterSeconds: number
}

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000
const MAX_TRACKED_CLIENTS = 10_000
const records = new Map<string, RateLimitRecord>()

export const rateLimitErrorResponseSchema = z.object({
  error: z.string(),
  retryAfter: z.number().int().nonnegative(),
})

export const getRateLimitPolicy = (pathname: string): RateLimitPolicy => {
  if (pathname === '/api/auth/login' || pathname === '/api/auth/register') {
    return { bucket: 'auth', maxRequests: 10, windowMs: FIFTEEN_MINUTES_MS }
  }

  return { bucket: 'api', maxRequests: 100, windowMs: FIFTEEN_MINUTES_MS }
}

export const getClientIdentifier = (headers: Headers) => {
  const forwardedAddress = headers.get('x-forwarded-for')?.split(',')[0]?.trim()

  return forwardedAddress || headers.get('x-real-ip')?.trim() || 'unknown'
}

const cleanupExpiredRecords = (now: number) => {
  if (records.size < MAX_TRACKED_CLIENTS) {
    return
  }

  for (const [key, record] of records) {
    if (record.resetAt <= now) {
      records.delete(key)
    }
  }

  if (records.size >= MAX_TRACKED_CLIENTS) {
    const oldestKey = records.keys().next().value

    if (oldestKey) {
      records.delete(oldestKey)
    }
  }
}

export const consumeRateLimit = (
  clientIdentifier: string,
  policy: RateLimitPolicy,
  now = Date.now()
): RateLimitResult => {
  cleanupExpiredRecords(now)

  const key = `${policy.bucket}:${clientIdentifier}`
  const currentRecord = records.get(key)
  const record = !currentRecord || currentRecord.resetAt <= now
    ? { count: 0, resetAt: now + policy.windowMs }
    : currentRecord

  if (record.count >= policy.maxRequests) {
    return {
      allowed: false,
      limit: policy.maxRequests,
      remaining: 0,
      resetAt: record.resetAt,
      retryAfterSeconds: Math.max(0, Math.ceil((record.resetAt - now) / 1000)),
    }
  }

  record.count += 1
  records.set(key, record)

  return {
    allowed: true,
    limit: policy.maxRequests,
    remaining: policy.maxRequests - record.count,
    resetAt: record.resetAt,
    retryAfterSeconds: 0,
  }
}

export const resetRateLimitStoreForTests = () => {
  records.clear()
}
