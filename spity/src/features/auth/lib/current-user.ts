import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import { authUserSchema, type AuthUser } from '../schemas'
import { getSessionFromCookies } from './session'

type UserRow = typeof users.$inferSelect

export const toAuthUser = (user: UserRow): AuthUser => {
  return authUserSchema.parse({
    id: user.id,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    emailVerified: Boolean(user.emailVerified),
  })
}

export const getCurrentUser = async () => {
  const session = await getSessionFromCookies()

  if (!session) {
    return null
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.sub)).limit(1)

  if (!user) {
    return null
  }

  return toAuthUser(user)
}
