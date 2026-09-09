import { requireAdmin, AdminError } from '@/features/admin/lib/access'
import { adminResponse, readModerationBody } from '@/features/admin/lib/http'
import { moderate } from '@/features/admin/lib/repository'
import { moderationSchema, moderationTargetSchema } from '@/features/admin/schemas'
import { logger } from '@/lib/logger'

export async function PATCH(request: Request, context: { params: Promise<{ kind: string; id: string }> }) {
  try {
    await requireAdmin()
    const target = moderationTargetSchema.safeParse(await context.params)
    if (!target.success) return adminResponse({ error: 'Cible invalide.' }, 400)
    const input = moderationSchema.safeParse(await readModerationBody(request))
    if (!input.success) return adminResponse({ error: 'Un état et un motif de 8 à 500 caractères sont requis.' }, 422)
    await moderate(target.data, input.data)
    return adminResponse({ ok: true })
  } catch (error) {
    if (error instanceof AdminError) return adminResponse({ error: error.message }, error.status)
    logger.error('admin.moderation_failed', { reason: 'internal_error' })
    return adminResponse({ error: 'Action impossible. Réessayez plus tard.' }, 500)
  }
}
