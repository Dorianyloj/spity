import { authErrorResponse } from './responses'

export const hasValidOrigin = (request: Request) => {
  const origin = request.headers.get('origin')

  if (!origin) {
    return true
  }

  const host = request.headers.get('host')

  if (!host) {
    return false
  }

  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export const rejectInvalidOrigin = (request: Request) => {
  if (hasValidOrigin(request)) {
    return null
  }

  return authErrorResponse('Origine de requête invalide', 403)
}
