import { ProfileOperationError, privateProfileResponse } from '@/features/profile/lib/http'
import { logger } from '@/lib/logger'

export const placeFailure = (error: unknown) => {
  if (error instanceof ProfileOperationError) {
    return privateProfileResponse({ error: error.message }, error.status)
  }

  logger.error('places.operation_failed')
  return privateProfileResponse({ error: 'Le service des lieux est momentanément indisponible. Réessaie dans un instant.' }, 503)
}
