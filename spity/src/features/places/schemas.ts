import { z } from 'zod'

export const placeKinds = ['salle', 'falaise'] as const
export const placeDisciplines = ['voie', 'bloc', 'grande_voie', 'trad', 'artif', 'deep_water_solo', 'via_ferrata', 'speed'] as const
export const rockTypes = ['calcaire', 'gres', 'granite', 'gneiss', 'schiste', 'conglomerat', 'volcanique', 'autre'] as const
export const rainExposures = ['abrite', 'partiellement_abrite', 'expose'] as const
export const sunlightOptions = ['ombrage', 'mixte', 'ensoleille'] as const
export const seasonOptions = ['printemps', 'ete', 'automne', 'hiver'] as const
export const orientationOptions = ['nord', 'nord_est', 'est', 'sud_est', 'sud', 'sud_ouest', 'ouest', 'nord_ouest'] as const
export const placeServices = ['vestiaires', 'douches', 'location_materiel', 'restauration', 'entrainement', 'parking_velo'] as const

const optionalText = (maximum: number) => z.string().trim().max(maximum)
const optionalUrl = z.union([z.literal(''), z.url('Saisis une adresse web valide.')])

export const placeCreationInputSchema = z.object({
  kind: z.enum(placeKinds),
  name: z.string().trim().min(2, 'Indique le nom du lieu.').max(255),
  photoMediaId: z.uuid().nullable(),
  disciplines: z.array(z.enum(placeDisciplines)).min(1, 'Choisis au moins une discipline.').max(placeDisciplines.length),
  latitude: z.number().min(-90, 'Latitude invalide.').max(90, 'Latitude invalide.'),
  longitude: z.number().min(-180, 'Longitude invalide.').max(180, 'Longitude invalide.'),
  city: z.string().trim().min(2, 'Indique la commune.').max(255),
  department: z.string().trim().min(2, 'Indique le département.').max(255),
  region: z.string().trim().min(2, 'Indique la région.').max(255),
  address: optionalText(500),
  rockType: z.union([z.literal(''), z.enum(rockTypes)]),
  rainExposure: z.union([z.literal(''), z.enum(rainExposures)]),
  sunlight: z.union([z.literal(''), z.enum(sunlightOptions)]),
  seasons: z.array(z.enum(seasonOptions)).max(seasonOptions.length),
  orientations: z.array(z.enum(orientationOptions)).max(orientationOptions.length),
  services: z.array(z.enum(placeServices)).max(placeServices.length),
  website: optionalUrl,
  access: optionalText(500),
  approach: optionalText(255),
  parking: optionalText(255),
  parkingLatitude: z.number().min(-90, 'Latitude du parking invalide.').max(90, 'Latitude du parking invalide.').nullable(),
  parkingLongitude: z.number().min(-180, 'Longitude du parking invalide.').max(180, 'Longitude du parking invalide.').nullable(),
  restrictions: optionalText(500),
  sourceUrl: optionalUrl,
  notes: optionalText(1000),
}).strict().superRefine((value, context) => {
  if (value.kind === 'salle') {
    if (!value.address) context.addIssue({ code: 'custom', path: ['address'], message: 'Indique l’adresse de la salle.' })
    if (value.disciplines.some((discipline) => !['voie', 'bloc', 'speed'].includes(discipline))) {
      context.addIssue({ code: 'custom', path: ['disciplines'], message: 'Cette discipline concerne les sites extérieurs.' })
    }
    return
  }
  if (!value.rockType) context.addIssue({ code: 'custom', path: ['rockType'], message: 'Choisis le type de roche.' })
  if (!value.rainExposure) context.addIssue({ code: 'custom', path: ['rainExposure'], message: 'Précise l’exposition à la pluie.' })
  if (!value.sunlight) context.addIssue({ code: 'custom', path: ['sunlight'], message: 'Précise l’ensoleillement.' })
  if (!value.seasons.length) context.addIssue({ code: 'custom', path: ['seasons'], message: 'Choisis au moins une saison favorable.' })
  if (!value.orientations.length) context.addIssue({ code: 'custom', path: ['orientations'], message: 'Choisis au moins une orientation.' })
  if ((value.parkingLatitude === null) !== (value.parkingLongitude === null)) {
    context.addIssue({ code: 'custom', path: ['parkingLatitude'], message: 'Place complètement le point du parking.' })
  }
})

export const placeReviewSchema = z.object({
  decision: z.enum(['approve', 'reject']),
  reason: z.string().trim().max(500),
}).strict().superRefine((value, context) => {
  if (value.decision === 'reject' && value.reason.length < 8) {
    context.addIssue({ code: 'custom', path: ['reason'], message: 'Précise le motif du refus (8 caractères minimum).' })
  }
})
export type PlaceReviewInput = z.infer<typeof placeReviewSchema>

export type PlaceCreationInput = z.infer<typeof placeCreationInputSchema>

export const placeRequestResponseSchema = z.object({
  request: z.object({ id: z.uuid(), status: z.literal('pending') }),
})

export const reverseGeocodeResponseSchema = z.object({ city: z.string(), region: z.string(), department: z.string() })

export const locationSearchResultSchema = z.object({
  id: z.string(),
  label: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  type: z.string(),
})
export const locationSearchResponseSchema = z.object({
  results: z.array(locationSearchResultSchema),
})
export type LocationSearchResult = z.infer<typeof locationSearchResultSchema>

export const disciplineLabels: Record<(typeof placeDisciplines)[number], string> = {
  voie: 'Voie', bloc: 'Bloc', grande_voie: 'Grande voie', trad: 'Trad', artif: 'Artif',
  deep_water_solo: 'Deep water solo', via_ferrata: 'Via ferrata', speed: 'Vitesse',
}

export const rockTypeLabels: Record<(typeof rockTypes)[number], string> = {
  calcaire: 'Calcaire', gres: 'Grès', granite: 'Granite', gneiss: 'Gneiss', schiste: 'Schiste',
  conglomerat: 'Conglomérat', volcanique: 'Roche volcanique', autre: 'Autre',
}

export const seasonLabels: Record<(typeof seasonOptions)[number], string> = {
  printemps: 'Printemps', ete: 'Été', automne: 'Automne', hiver: 'Hiver',
}

export const orientationLabels: Record<(typeof orientationOptions)[number], string> = {
  nord: 'N', nord_est: 'NE', est: 'E', sud_est: 'SE', sud: 'S', sud_ouest: 'SO', ouest: 'O', nord_ouest: 'NO',
}
