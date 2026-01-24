import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Store rate limit data in memory (for production, use Redis)
const ratelimit = new Map<string, { count: number; resetTime: number }>()

// Clean up old entries every 15 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of ratelimit.entries()) {
    if (now > value.resetTime) {
      ratelimit.delete(key)
    }
  }
}, 15 * 60 * 1000)

export function middleware(request: NextRequest) {
  // Get client IP
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1'
  const now = Date.now()

  // Rate limit configuration: 100 requests per 15 minutes
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 100

  const record = ratelimit.get(ip)

  // If no record or window expired, create new record
  if (!record || now > record.resetTime) {
    ratelimit.set(ip, { count: 1, resetTime: now + windowMs })
    return NextResponse.next()
  }

  // If limit exceeded, return 429
  if (record.count >= maxRequests) {
    return new NextResponse(
      JSON.stringify({
        error: 'Trop de requêtes. Veuillez réessayer plus tard.',
        retryAfter: Math.ceil((record.resetTime - now) / 1000)
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil((record.resetTime - now) / 1000))
        }
      }
    )
  }

  // Increment counter
  record.count++

  return NextResponse.next()
}

// Apply rate limiting to API routes
export const config = {
  matcher: '/api/:path*',
}
