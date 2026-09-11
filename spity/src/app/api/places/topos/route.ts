import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'
import { handleMediaError } from '@/features/media/lib/responses'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { ProfileOperationError, privateProfileResponse, readProfileBody } from '@/features/profile/lib/http'
import { readTopoPdfUpload } from '@/features/places/lib/topo-upload'
import { createCragPdfTopo, createCragTopoLink } from '@/features/places/lib/request-repository'
import { cragTopoLinkInputSchema, cragTopoPdfInputSchema } from '@/features/places/schemas'
import { consumeRateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'

const topoFailure = (error: unknown) => {
  if (error instanceof ProfileOperationError) return privateProfileResponse({ error: error.message }, error.status)
  return handleMediaError(error)
}

export async function POST(request: Request) {
  const invalidOrigin = rejectInvalidOrigin(request)
  if (invalidOrigin) return invalidOrigin

  try {
    const profile = await getCurrentProfile()
    if (!profile) return privateProfileResponse({ error: 'Authentification requise.' }, 401)
    if (profile.user.role !== 'grimpeur' || !profile.grimpeurProfile) {
      return privateProfileResponse({ error: 'Cette action est réservée aux grimpeurs ayant complété leur profil.' }, 403)
    }

    const limit = consumeRateLimit(`crag-topos:${profile.user.id}`, {
      bucket: 'api',
      maxRequests: 8,
      windowMs: 15 * 60 * 1000,
    })
    if (!limit.allowed) {
      return privateProfileResponse({ error: 'Trop de topos ajoutés. Réessaie dans quelques minutes.' }, 429)
    }

    if (request.headers.get('content-type')?.split(';')[0].trim() === 'application/json') {
      const parsed = cragTopoLinkInputSchema.safeParse(await readProfileBody(request))
      if (!parsed.success) {
        return privateProfileResponse({
          error: 'Vérifie le lien du topo.',
          issues: parsed.error.issues.map(({ path, message }) => ({ path: path.join('.'), message })),
        }, 422)
      }
      return privateProfileResponse({ topo: await createCragTopoLink(profile.user.id, parsed.data) }, 201)
    }

    const upload = await readTopoPdfUpload(request)
    const parsed = cragTopoPdfInputSchema.safeParse({ falaiseId: upload.falaiseId, title: upload.title, type: 'pdf' })
    if (!parsed.success) {
      return privateProfileResponse({
        error: 'Vérifie les informations du topo.',
        issues: parsed.error.issues.map(({ path, message }) => ({ path: path.join('.'), message })),
      }, 422)
    }
    const data = Buffer.from(await upload.file.arrayBuffer())
    return privateProfileResponse({ topo: await createCragPdfTopo(profile.user.id, parsed.data, data) }, 201)
  } catch (error) {
    return topoFailure(error)
  }
}
