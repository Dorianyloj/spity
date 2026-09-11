import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { privateProfileResponse, readProfileBody } from '@/features/profile/lib/http'
import { placeFailure } from '@/features/places/lib/http'
import { createCragReport } from '@/features/places/lib/request-repository'
import { cragReportInputSchema } from '@/features/places/schemas'
import { consumeRateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const profile = await getCurrentProfile()
    if (!profile) return privateProfileResponse({ error: 'Authentification requise.' }, 401)
    if (profile.user.role !== 'grimpeur' || !profile.grimpeurProfile) {
      return privateProfileResponse({ error: 'Cette action est réservée aux grimpeurs ayant complété leur profil.' }, 403)
    }

    const parsed = cragReportInputSchema.safeParse(await readProfileBody(request))
    if (!parsed.success) {
      return privateProfileResponse({
        error: 'Vérifie les informations du signalement.',
        issues: parsed.error.issues.map(({ path, message }) => ({ path: path.join('.'), message })),
      }, 422)
    }

    const limit = consumeRateLimit(`crag-reports:${profile.user.id}`, {
      bucket: 'api',
      maxRequests: 12,
      windowMs: 15 * 60 * 1000,
    })
    if (!limit.allowed) {
      return privateProfileResponse({ error: 'Trop de signalements envoyés. Réessaie dans quelques minutes.' }, 429)
    }

    const report = await createCragReport(profile.user.id, parsed.data)
    return privateProfileResponse({ report }, 201)
  } catch (error) {
    return placeFailure(error)
  }
}
