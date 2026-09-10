import { z } from 'zod'
import { AdminError, requireAdmin } from '@/features/admin/lib/access'
import { adminResponse, readModerationBody } from '@/features/admin/lib/http'
import { reviewPlaceRequest } from '@/features/admin/lib/repository'
import { placeReviewSchema } from '@/features/places/schemas'
import { logger } from '@/lib/logger'

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const id = z.uuid().safeParse((await context.params).id)
    if (!id.success) return adminResponse({ error: 'Demande invalide.' }, 400)
    const input = placeReviewSchema.safeParse(await readModerationBody(request))
    if (!input.success) {
      return adminResponse({ error: input.error.issues[0]?.message ?? 'Décision invalide.' }, 422)
    }
    await reviewPlaceRequest(id.data, input.data)
    return adminResponse({ ok: true })
  } catch (error) {
    if (error instanceof AdminError) return adminResponse({ error: error.message }, error.status)
    logger.error('admin.place_review_failed', { reason: 'internal_error' })
    return adminResponse({ error: 'Action impossible. Réessayez plus tard.' }, 500)
  }
}
