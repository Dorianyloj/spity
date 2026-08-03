import { randomUUID } from 'crypto'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import { registerSchema } from '@/lib/validators'
import { hashPassword } from '@/features/auth/lib/password'
import { authErrorResponse, authUserResponse } from '@/features/auth/lib/responses'
import { createSessionToken, setSessionCookie } from '@/features/auth/lib/session'
import { toAuthUser } from '@/features/auth/lib/current-user'
import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'
import { logger } from '@/lib/logger'
import { rejectExceededAuthRateLimit } from '@/features/auth/lib/rate-limit'

export async function POST(request: Request) {
  const invalidOriginResponse = rejectInvalidOrigin(request)

  if (invalidOriginResponse) {
    return invalidOriginResponse
  }

  const rateLimitResponse = rejectExceededAuthRateLimit(request)

  if (rateLimitResponse) {
    return rateLimitResponse
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return authErrorResponse('Corps de requête JSON invalide', 400)
  }

  const parsedBody = registerSchema.safeParse(body)

  if (!parsedBody.success) {
    return authErrorResponse(
      'Données d\'inscription invalides',
      422,
      parsedBody.error.issues.map((issue) => issue.message)
    )
  }

  const email = parsedBody.data.email.toLowerCase()
  const [existingUser] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1)

  if (existingUser) {
    logger.warn('auth.registration_rejected', { reason: 'duplicate_email' })
    return authErrorResponse('Un compte existe déjà avec cet email', 409)
  }

  const userId = randomUUID()
  const passwordHash = await hashPassword(parsedBody.data.password)

  await db.insert(users).values({
    id: userId,
    email,
    passwordHash,
    role: parsedBody.data.role,
  })

  const [createdUser] = await db.select().from(users).where(eq(users.id, userId)).limit(1)

  if (!createdUser) {
    return authErrorResponse('Création du compte impossible', 500)
  }

  const user = toAuthUser(createdUser)
  const response = authUserResponse(user, 201)
  setSessionCookie(response, createSessionToken(user))
  logger.info('auth.registration_succeeded', { userId: user.id, role: user.role })

  return response
}
