import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { privateProfileResponse, readProfileBody } from '@/features/profile/lib/http'
import { placeFailure } from '@/features/places/lib/http'
import { createPlaceRequest } from '@/features/places/lib/request-repository'
import { placeCreationInputSchema, placeRequestResponseSchema } from '@/features/places/schemas'
import { consumeRateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const profile = await getCurrentProfile()

    if (!profile) return privateProfileResponse({ error: 'Authentification requise.' }, 401)
    if (profile.user.role !== 'grimpeur') {
      return privateProfileResponse({ error: 'Cette action est réservée aux grimpeurs.' }, 403)
    }
    if (!profile.grimpeurProfile) {
      return privateProfileResponse({ error: 'Complète ton profil avant de proposer un lieu.' }, 409)
    }

    const parsed = placeCreationInputSchema.safeParse(await readProfileBody(request))

    if (!parsed.success) {
      return privateProfileResponse({
        error: 'Vérifie les informations du lieu.',
        issues: parsed.error.issues.map(({ path, message }) => ({ path: path.join('.'), message })),
      }, 422)
    }

    const limit = consumeRateLimit(`place-requests:${profile.user.id}`, {
      bucket: 'api',
      maxRequests: 10,
      windowMs: 15 * 60 * 1000,
    })
    if (!limit.allowed) {
      return privateProfileResponse({ error: 'Trop de propositions envoyées. Réessaie dans quelques minutes.' }, 429)
    }

    const createdRequest = await createPlaceRequest(profile.user.id, parsed.data)

    return privateProfileResponse(placeRequestResponseSchema.parse({ request: createdRequest }), 201)
  } catch (error) {
    return placeFailure(error)
  }
}
