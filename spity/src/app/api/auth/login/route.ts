import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import { loginSchema } from '@/lib/validators'
import { verifyPassword } from '@/features/auth/lib/password'
import { authErrorResponse, authUserResponse } from '@/features/auth/lib/responses'
import { createSessionToken, setSessionCookie } from '@/features/auth/lib/session'
import { toAuthUser } from '@/features/auth/lib/current-user'
import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000

export async function POST(request: Request) {
  const invalidOriginResponse = rejectInvalidOrigin(request)

  if (invalidOriginResponse) {
    return invalidOriginResponse
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return authErrorResponse('Corps de requête JSON invalide', 400)
  }

  const parsedBody = loginSchema.safeParse(body)

  if (!parsedBody.success) {
    return authErrorResponse(
      'Données de connexion invalides',
      422,
      parsedBody.error.issues.map((issue) => issue.message)
    )
  }

  const email = parsedBody.data.email.toLowerCase()
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

  if (!user) {
    return authErrorResponse('Identifiants invalides', 401)
  }

  if (user.lockoutUntil && user.lockoutUntil > new Date()) {
    return authErrorResponse('Compte temporairement verrouillé. Réessayez plus tard.', 423)
  }

  const passwordMatches = await verifyPassword(parsedBody.data.password, user.passwordHash)

  if (!passwordMatches) {
    const nextFailedLoginAttempts = (user.failedLoginAttempts ?? 0) + 1
    const nextLockoutUntil =
      nextFailedLoginAttempts >= MAX_LOGIN_ATTEMPTS ? new Date(Date.now() + LOCKOUT_MS) : null

    await db
      .update(users)
      .set({
        failedLoginAttempts: nextFailedLoginAttempts,
        lockoutUntil: nextLockoutUntil,
      })
      .where(eq(users.id, user.id))

    return authErrorResponse('Identifiants invalides', 401)
  }

  await db
    .update(users)
    .set({
      failedLoginAttempts: 0,
      lockoutUntil: null,
    })
    .where(eq(users.id, user.id))

  const authUser = toAuthUser(user)
  const response = authUserResponse(authUser)
  setSessionCookie(response, createSessionToken(authUser))

  return response
}
