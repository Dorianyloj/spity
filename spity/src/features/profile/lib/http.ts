import { hasValidOrigin } from '@/features/auth/lib/csrf'
import { logger } from '@/lib/logger'

export class ProfileOperationError extends Error {
  constructor(message: string, public readonly status: number) { super(message) }
}
export function privateProfileResponse(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie', 'X-Robots-Tag': 'noindex, nofollow' } })
}
export function profileFailure(error: unknown) {
  if (error instanceof ProfileOperationError) return privateProfileResponse({ error: error.message }, error.status)
  logger.error('profile.operation_failed')
  return privateProfileResponse({ error: 'Le profil est momentanément indisponible. Réessaie dans un instant.' }, 503)
}
export async function readProfileBody(request: Request): Promise<unknown> {
  const origin = request.headers.get('origin')
  if (!origin || !/^https?:\/\//.test(origin) || !hasValidOrigin(request)) throw new ProfileOperationError('Origine de requête invalide.', 403)
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') throw new ProfileOperationError('JSON requis.', 415)
  const reader = request.body?.getReader()
  if (!reader) throw new ProfileOperationError('Corps JSON invalide.', 400)
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 16_384) { await reader.cancel(); throw new ProfileOperationError('Requête trop volumineuse.', 413) }
      chunks.push(value)
    }
    try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown }
    catch { throw new ProfileOperationError('Corps JSON invalide.', 400) }
  } finally { reader.releaseLock() }
}
