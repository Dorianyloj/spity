import { getCurrentUser } from '@/features/auth/lib/current-user'
import { privateProfileResponse, profileFailure, readProfileBody } from '@/features/profile/lib/http'
import { createProfilePost } from '@/features/profile/lib/workspace-repository'
import { createProfilePostSchema } from '@/features/profile/workspace-schemas'
import { consumeRateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return privateProfileResponse({ error: 'Authentification requise.' }, 401)
    const parsed = createProfilePostSchema.safeParse(await readProfileBody(request))
    if (!parsed.success) return privateProfileResponse({ error: parsed.error.issues[0]?.message ?? 'Publication invalide.' }, 422)
    const limit = consumeRateLimit(`profile-posts:${user.id}`, { bucket: 'api', maxRequests: 10, windowMs: 15 * 60 * 1000 })
    if (!limit.allowed) return privateProfileResponse({ error: 'Trop de publications. Réessaie dans quelques minutes.' }, 429)
    return privateProfileResponse({ id: await createProfilePost(user.id, parsed.data) }, 201)
  } catch (error) { return profileFailure(error) }
}
