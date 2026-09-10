import { z } from 'zod'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { privateProfileResponse } from '@/features/profile/lib/http'
import { placeFailure } from '@/features/places/lib/http'
import { reverseGeocodeResponseSchema } from '@/features/places/schemas'

const coordinatesSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
})

const communeSchema = z.object({
  nom: z.string(),
  departement: z.object({ nom: z.string() }),
  region: z.object({ nom: z.string() }),
})

export async function GET(request: Request) {
  try {
    const profile = await getCurrentProfile()

    if (!profile) return privateProfileResponse({ error: 'Authentification requise.' }, 401)
    if (profile.user.role !== 'grimpeur') {
      return privateProfileResponse({ error: 'Cette action est réservée aux grimpeurs.' }, 403)
    }

    const url = new URL(request.url)
    const coordinates = coordinatesSchema.safeParse({
      lat: url.searchParams.get('lat'),
      lon: url.searchParams.get('lon'),
    })

    if (!coordinates.success) {
      return privateProfileResponse({ error: 'Coordonnées invalides.' }, 422)
    }

    const endpoint = new URL('https://geo.api.gouv.fr/2025/communes')
    endpoint.searchParams.set('lat', String(coordinates.data.lat))
    endpoint.searchParams.set('lon', String(coordinates.data.lon))
    endpoint.searchParams.set('fields', 'nom,region,departement')

    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    })

    if (!response.ok) throw new Error('reverse_geocode_failed')

    const communes = z.array(communeSchema).safeParse(await response.json())
    const commune = communes.success ? communes.data[0] : null

    if (!commune) {
      return privateProfileResponse({ error: 'Aucune commune trouvée pour ce point. Tu peux la saisir manuellement.' }, 404)
    }

    return privateProfileResponse(reverseGeocodeResponseSchema.parse({
      city: commune.nom,
      department: commune.departement.nom,
      region: commune.region.nom,
    }))
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      return privateProfileResponse({ error: 'La localisation automatique prend trop de temps. Tu peux saisir les champs manuellement.' }, 504)
    }
    return placeFailure(error)
  }
}
