import { authMessageResponse } from '@/features/auth/lib/responses'
import { clearSessionCookie } from '@/features/auth/lib/session'
import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'

export async function POST(request: Request) {
  const invalidOriginResponse = rejectInvalidOrigin(request)

  if (invalidOriginResponse) {
    return invalidOriginResponse
  }

  const response = authMessageResponse('Déconnexion réussie')
  clearSessionCookie(response)

  return response
}
