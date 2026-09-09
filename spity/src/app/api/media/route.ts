import { getCurrentUser } from '@/features/auth/lib/current-user'
import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'
import { normalizeImage, readImageUpload } from '@/features/media/lib/image-upload'
import { createMediaUpload } from '@/features/media/lib/media-repository'
import { handleMediaError, mediaErrorResponse } from '@/features/media/lib/responses'
import { consumeRateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const invalidOrigin = rejectInvalidOrigin(request)
  if (invalidOrigin) return invalidOrigin
  try {
    const user = await getCurrentUser()
    if (!user) return mediaErrorResponse('Authentification requise', 401)
    const limit = consumeRateLimit(user.id, { bucket: 'media', maxRequests: 10, windowMs: 15 * 60 * 1000 })
    if (!limit.allowed) {
      return Response.json({ error: 'Trop d’imports, réessayez plus tard', retryAfter: limit.retryAfterSeconds }, {
        status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds), 'Cache-Control': 'no-store' },
      })
    }
    const file = await readImageUpload(request)
    const media = await createMediaUpload(user.id, await normalizeImage(file))
    return Response.json({ media }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return handleMediaError(error)
  }
}
