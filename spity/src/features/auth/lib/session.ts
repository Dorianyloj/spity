import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { sessionPayloadSchema, type AuthUser, type SessionPayload } from '../schemas'

export const SESSION_COOKIE_NAME = 'spity_session'

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

const base64UrlEncode = (value: unknown) => {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url')
}

const base64UrlDecode = (value: string): unknown => {
  return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as unknown
}

const sign = (value: string) => {
  return createHmac('sha256', env.JWT_SECRET).update(value).digest('base64url')
}

const hasValidSignature = (value: string, signature: string) => {
  const expectedSignature = sign(value)
  const expectedBuffer = Buffer.from(expectedSignature, 'base64url')
  const signatureBuffer = Buffer.from(signature, 'base64url')

  if (expectedBuffer.byteLength !== signatureBuffer.byteLength) {
    return false
  }

  return timingSafeEqual(expectedBuffer, signatureBuffer)
}

export const createSessionToken = (user: AuthUser) => {
  const now = Math.floor(Date.now() / 1000)
  const header = base64UrlEncode({ alg: 'HS256', typ: 'JWT' })
  const payload = base64UrlEncode({
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  })
  const unsignedToken = `${header}.${payload}`

  return `${unsignedToken}.${sign(unsignedToken)}`
}

export const verifySessionToken = (token: string): SessionPayload | null => {
  const [header, payload, signature, extra] = token.split('.')

  if (!header || !payload || !signature || extra) {
    return null
  }

  const unsignedToken = `${header}.${payload}`

  if (!hasValidSignature(unsignedToken, signature)) {
    return null
  }

  try {
    const parsedPayload = sessionPayloadSchema.safeParse(base64UrlDecode(payload))

    if (!parsedPayload.success) {
      return null
    }

    if (parsedPayload.data.exp <= Math.floor(Date.now() / 1000)) {
      return null
    }

    return parsedPayload.data
  } catch {
    return null
  }
}

export const setSessionCookie = (response: NextResponse, token: string) => {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
}

export const clearSessionCookie = (response: NextResponse) => {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

export const getSessionFromCookies = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  return verifySessionToken(token)
}
