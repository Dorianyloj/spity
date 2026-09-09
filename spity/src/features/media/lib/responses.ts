import { logger } from '@/lib/logger'
import { MediaOperationError } from './errors'

export const mediaErrorResponse = (message: string, status: number) => Response.json(
  { error: message }, { status, headers: { 'Cache-Control': 'no-store' } }
)

export const handleMediaError = (error: unknown) => {
  if (error instanceof MediaOperationError) return mediaErrorResponse(error.message, error.status)
  // Never expose filesystem paths, SQL errors, submitted filenames or image contents.
  logger.error('media.operation_failed')
  return mediaErrorResponse('Le service de médias est momentanément indisponible', 503)
}
