import { getCurrentUser } from '@/features/auth/lib/current-user'

export class AdminError extends Error {
  constructor(message: string, public status: number) { super(message) }
}

export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user) throw new AdminError('Connexion requise.', 401)
  if (!user.isAdmin) throw new AdminError('Accès administrateur requis.', 403)
  return user
}
