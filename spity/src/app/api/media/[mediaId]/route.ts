import { getCurrentUser } from '@/features/auth/lib/current-user'
import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'
import { deleteOwnedMedia, findOwnedMedia } from '@/features/media/lib/media-repository'
import { handleMediaError, mediaErrorResponse } from '@/features/media/lib/responses'
import { mediaIdSchema, readImage } from '@/features/media/lib/storage'

export const runtime = 'nodejs'
type MediaContext = { params: Promise<{ mediaId: string }> }

export async function GET(_request: Request, context: MediaContext) {
  try {
    const user = await getCurrentUser()
    if (!user) return mediaErrorResponse('Authentification requise', 401)
    const id = mediaIdSchema.safeParse((await context.params).mediaId)
    if (!id.success) return mediaErrorResponse('Image introuvable', 404)
    const media = await findOwnedMedia(id.data, user.id)
    if (!media) return mediaErrorResponse('Image introuvable', 404)
    let data: Buffer
    try {
      data = await readImage(media.id)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return mediaErrorResponse('Image introuvable', 404)
      throw error
    }
    return new Response(new Uint8Array(data), { headers: {
      'Content-Type': 'image/webp',
      'Content-Length': String(data.length),
      'Content-Disposition': `inline; filename="${media.id}.webp"`,
      'X-Content-Type-Options': 'nosniff',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Cache-Control': 'private, no-store',
      'Vary': 'Cookie',
      'Content-Security-Policy': "default-src 'none'; sandbox",
    } })
  } catch (error) {
    return handleMediaError(error)
  }
}

export async function DELETE(request: Request, context: MediaContext) {
  const invalidOrigin = rejectInvalidOrigin(request)
  if (invalidOrigin) return invalidOrigin
  try {
    const user = await getCurrentUser()
    if (!user) return mediaErrorResponse('Authentification requise', 401)
    const id = mediaIdSchema.safeParse((await context.params).mediaId)
    if (!id.success) return mediaErrorResponse('Image introuvable', 404)
    await deleteOwnedMedia(id.data, user.id)
    return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return handleMediaError(error)
  }
}
