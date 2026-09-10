import { z } from 'zod'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { privateProfileResponse } from '@/features/profile/lib/http'
import { placeFailure } from '@/features/places/lib/http'
import { locationSearchResponseSchema } from '@/features/places/schemas'
import { consumeRateLimit } from '@/lib/rate-limit'

const querySchema = z.string().trim().min(2).max(120)
const geocodingResponseSchema = z.object({
  features: z.array(z.object({
    geometry: z.object({ coordinates: z.tuple([z.number(), z.number()]) }),
    properties: z.object({
      id: z.union([z.string(), z.number()]),
      label: z.string(),
      type: z.string().optional(),
    }),
  })),
})

export async function GET(request: Request) {
  try {
    const profile = await getCurrentProfile()
    if (!profile) return privateProfileResponse({ error: 'Authentification requise.' }, 401)
    if (profile.user.role !== 'grimpeur') {
      return privateProfileResponse({ error: 'Cette action est réservée aux grimpeurs.' }, 403)
    }

    const query = querySchema.safeParse(new URL(request.url).searchParams.get('q'))
    if (!query.success) {
      return privateProfileResponse({ error: 'Saisis au moins 2 caractères.' }, 422)
    }

    const limit = consumeRateLimit(`place-search:${profile.user.id}`, {
      bucket: 'api',
      maxRequests: 40,
      windowMs: 5 * 60 * 1000,
    })
    if (!limit.allowed) {
      return privateProfileResponse({ error: 'Trop de recherches. Réessaie dans quelques minutes.' }, 429)
    }

    const endpoint = new URL('https://data.geopf.fr/geocodage/search/')
    endpoint.searchParams.set('q', query.data)
    endpoint.searchParams.set('limit', '6')

    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    })
    if (!response.ok) throw new Error('location_search_failed')

    const parsed = geocodingResponseSchema.safeParse(await response.json())
    if (!parsed.success) throw new Error('location_search_invalid_response')

    return privateProfileResponse(locationSearchResponseSchema.parse({
      results: parsed.data.features.map((feature, index) => ({
        id: `${feature.properties.id}-${index}`,
        label: feature.properties.label,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        type: feature.properties.type ?? 'place',
      })),
    }))
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      return privateProfileResponse({ error: 'La recherche prend trop de temps. Réessaie.' }, 504)
    }
    return placeFailure(error)
  }
}
