import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { mediaUploads, placeCreationRequests } from '@/db/schema'
import { AdminError, requireAdmin } from '@/features/admin/lib/access'
import { adminResponse } from '@/features/admin/lib/http'
import { handleMediaError, mediaErrorResponse } from '@/features/media/lib/responses'
import { mediaIdSchema, readImage } from '@/features/media/lib/storage'

export const runtime = 'nodejs'

export async function GET(_request: Request, context: { params: Promise<{ mediaId: string }> }) {
  try {
    await requireAdmin()
    const id = mediaIdSchema.safeParse((await context.params).mediaId)
    if (!id.success) return mediaErrorResponse('Image introuvable', 404)
    const [media] = await db.select({ id: mediaUploads.id }).from(mediaUploads)
      .innerJoin(placeCreationRequests, eq(placeCreationRequests.photoMediaId, mediaUploads.id))
      .where(eq(mediaUploads.id, id.data)).limit(1)
    if (!media) return mediaErrorResponse('Image introuvable', 404)
    const data = await readImage(media.id)

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
    if (error instanceof AdminError) return adminResponse({ error: error.message }, error.status)
    return handleMediaError(error)
  }
}
