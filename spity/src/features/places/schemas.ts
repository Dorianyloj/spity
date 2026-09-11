import { z } from 'zod'
import { cragRouteDisciplines } from '@/lib/climbing-disciplines'

export const placeKinds = ['salle', 'falaise'] as const
export const placeDisciplines = ['voie', 'bloc', 'grande_voie', 'trad', 'artif', 'deep_water_solo', 'via_ferrata', 'speed'] as const
export const rockTypes = ['calcaire', 'gres', 'granite', 'gneiss', 'schiste', 'conglomerat', 'volcanique', 'autre'] as const
export const rainExposures = ['abrite', 'partiellement_abrite', 'expose'] as const
export const sunlightOptions = ['ombrage', 'mixte', 'ensoleille'] as const
export const seasonOptions = ['printemps', 'ete', 'automne', 'hiver'] as const
export const orientationOptions = ['nord', 'nord_est', 'est', 'sud_est', 'sud', 'sud_ouest', 'ouest', 'nord_ouest'] as const
export const placeServices = ['vestiaires', 'douches', 'location_materiel', 'restauration', 'entrainement', 'parking_velo'] as const
export const routeStyles = ['dalle', 'devers', 'vertical', 'fissure', 'pilier', 'mixte'] as const
export const routeConditions = ['ok', 'humide', 'spit_a_verifier', 'fermee'] as const
export const conditionStates = ['sec', 'humide', 'attention', 'ferme'] as const
export const cragReportTypes = ['condition', 'access', 'safety', 'info'] as const

const optionalText = (maximum: number) => z.string().trim().max(maximum)
const optionalUrl = z.union([z.literal(''), z.url('Saisis une adresse web valide.')])
const nullableCoordinate = (minimum: number, maximum: number, message: string) => z.number().min(minimum, message).max(maximum, message).nullable()

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

const changeRequestBase = z.object({
  placeId: z.uuid(),
  message: optionalText(500),
  photoMediaIds: z.array(z.uuid()).max(6, 'Ajoute au maximum 6 photos par demande.')
    .refine((ids) => new Set(ids).size === ids.length, 'Chaque photo ne peut être ajoutée qu’une fois.'),
  name: z.string().trim().min(2, 'Indique le nom du lieu.').max(255),
  city: z.string().trim().min(2, 'Indique la commune.').max(255),
  department: optionalText(255),
  region: optionalText(255),
  latitude: nullableCoordinate(-90, 90, 'Latitude invalide.'),
  longitude: nullableCoordinate(-180, 180, 'Longitude invalide.'),
  restrictions: optionalText(500),
  sourceUrl: optionalUrl,
  notes: optionalText(1000),
})

const coordinatesTogether = (value: { latitude: number | null; longitude: number | null }, context: z.RefinementCtx) => {
  if ((value.latitude === null) !== (value.longitude === null)) {
    context.addIssue({ code: 'custom', path: ['latitude'], message: 'Renseigne les deux coordonnées du lieu.' })
  }
}

export const placeChangeInputSchema = z.discriminatedUnion('kind', [
  changeRequestBase.extend({
    kind: z.literal('salle'),
    address: z.string().trim().min(4, 'Indique l’adresse de la salle.').max(500),
    disciplines: z.array(z.enum(['voie', 'bloc', 'speed'])).min(1, 'Choisis au moins une discipline.').max(3),
    services: z.array(z.enum(placeServices)).max(placeServices.length),
    website: optionalUrl,
    weekdayHours: optionalText(120),
    weekendHours: optionalText(120),
    entryPrice: optionalText(80),
    subscriptionPrice: optionalText(80),
    minimumLevel: optionalText(10),
    maximumLevel: optionalText(10),
    attendance: z.union([z.literal(''), z.enum(['calme', 'moderee', 'elevee'])]),
  }).superRefine(coordinatesTogether),
  changeRequestBase.extend({
    kind: z.literal('falaise'),
    disciplines: z.array(z.enum(placeDisciplines)).max(placeDisciplines.length),
    rockType: z.union([z.literal(''), z.enum(rockTypes)]),
    rainExposure: z.union([z.literal(''), z.enum(rainExposures)]),
    sunlight: z.union([z.literal(''), z.enum(sunlightOptions)]),
    levels: optionalText(500),
    orientation: z.union([z.literal(''), z.enum(['nord', 'sud', 'est', 'ouest', 'multi'])]),
    orientations: z.array(z.enum(orientationOptions)).max(orientationOptions.length),
    seasons: z.array(z.enum(seasonOptions)).max(seasonOptions.length),
    status: z.union([z.literal(''), z.enum(['sec', 'humide', 'attention', 'ferme'])]),
    access: optionalText(500),
    approach: optionalText(255),
    parking: optionalText(255),
    parkingLatitude: nullableCoordinate(-90, 90, 'Latitude du parking invalide.'),
    parkingLongitude: nullableCoordinate(-180, 180, 'Longitude du parking invalide.'),
  }).superRefine((value, context) => {
    coordinatesTogether(value, context)
    if ((value.parkingLatitude === null) !== (value.parkingLongitude === null)) {
      context.addIssue({ code: 'custom', path: ['parkingLatitude'], message: 'Renseigne les deux coordonnées du parking.' })
    }
  }),
])

export type PlaceChangeInput = z.infer<typeof placeChangeInputSchema>

const optionalPositiveInteger = z.number().int().min(1).max(2_000).nullable()

export const cragRouteInputSchema = z.object({
  falaiseId: z.uuid('Falaise invalide.'),
  nom: z.string().trim().min(2, 'Indique le nom de la voie.').max(255),
  discipline: z.enum(cragRouteDisciplines),
  cotation: z.string().trim().regex(/^[3-9][a-c]\+?$/, 'Indique une cotation valide, par exemple 6a+.'),
  secteur: optionalText(120),
  hauteur: optionalPositiveInteger,
  degaines: z.number().int().min(1).max(100).nullable(),
  style: z.union([z.literal(''), z.enum(routeStyles)]),
  status: z.enum(routeConditions),
}).strict()

export const cragReportInputSchema = z.discriminatedUnion('type', [
  z.object({
    falaiseId: z.uuid('Falaise invalide.'),
    type: z.literal('condition'),
    conditionState: z.enum(conditionStates),
    message: optionalText(500),
  }).strict(),
  z.object({
    falaiseId: z.uuid('Falaise invalide.'),
    type: z.enum(['access', 'safety', 'info']),
    message: z.string().trim().min(8, 'Décris le signalement en au moins 8 caractères.').max(500),
  }).strict(),
])

export const cragTopoLinkInputSchema = z.object({
  falaiseId: z.uuid('Falaise invalide.'),
  type: z.literal('link'),
  title: z.string().trim().min(2, 'Indique le titre du topo.').max(255),
  url: z.url('Saisis une adresse web valide.').refine((value) => {
    const protocol = new URL(value).protocol
    return protocol === 'http:' || protocol === 'https:'
  }, 'Utilise une adresse http ou https.'),
}).strict()

export const cragTopoPdfInputSchema = z.object({
  falaiseId: z.uuid('Falaise invalide.'),
  type: z.literal('pdf'),
  title: z.string().trim().min(2, 'Indique le titre du topo.').max(255),
}).strict()

export type CragRouteInput = z.infer<typeof cragRouteInputSchema>
export type CragReportInput = z.infer<typeof cragReportInputSchema>
export type CragTopoLinkInput = z.infer<typeof cragTopoLinkInputSchema>
export type CragTopoPdfInput = z.infer<typeof cragTopoPdfInputSchema>

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
