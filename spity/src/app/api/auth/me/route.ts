import { getCurrentUser } from '@/features/auth/lib/current-user'
import { authStatusResponse } from '@/features/auth/lib/responses'

export async function GET() {
  const user = await getCurrentUser()

  return authStatusResponse(Boolean(user), user)
}
