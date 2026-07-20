import { authErrorResponse } from './responses'
import { logger } from '@/lib/logger'

export const hasValidOrigin = (request: Request) => {
  if (request.headers.get('sec-fetch-site') === 'cross-site') {
    return false
  }

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

  const origin = request.headers.get('origin')
  let originHost = 'absent-or-invalid'

  if (origin) {
    try {
      originHost = new URL(origin).host
    } catch {
      // Raw untrusted header values are intentionally not logged.
    }
  }

  logger.warn('security.origin_rejected', { originHost })

  return authErrorResponse('Origine de requête invalide', 403)
}
