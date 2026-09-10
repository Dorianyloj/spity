import { placeCreationInputSchema } from './schemas'

const baseRequest = {
  kind: 'falaise' as const,
  name: 'Roche Corbière',
  disciplines: ['voie'] as const,
  latitude: 45.9,
  longitude: 4.1,
  city: 'Exemple-sur-Roche',
  department: 'Rhône',
  region: 'Auvergne-Rhône-Alpes',
  address: '',
  rockType: 'calcaire' as const,
  rainExposure: 'expose' as const,
  sunlight: 'mixte' as const,
  seasons: ['printemps'] as const,
  orientations: ['sud'] as const,
  services: [] as const,
  website: '',
  access: '',
  approach: '',
  parking: '',
  parkingLatitude: null,
  parkingLongitude: null,
  restrictions: '',
  sourceUrl: '',
  notes: '',
}

describe('placeCreationInputSchema', () => {
  it('accepts a complete outdoor place suggestion', () => {
    expect(placeCreationInputSchema.safeParse(baseRequest).success).toBe(true)
  })

  it('requires outdoor conditions for a crag', () => {
    const parsed = placeCreationInputSchema.safeParse({
      ...baseRequest,
      rockType: '',
      rainExposure: '',
      sunlight: '',
      seasons: [],
      orientations: [],
    })

    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      expect(parsed.error.issues.map((issue) => issue.path[0])).toEqual(expect.arrayContaining([
        'rockType', 'rainExposure', 'sunlight', 'seasons', 'orientations',
      ]))
    }
  })

  it('keeps the two parking coordinates together', () => {
    expect(placeCreationInputSchema.safeParse({ ...baseRequest, parkingLatitude: 45.9 }).success).toBe(false)
    expect(placeCreationInputSchema.safeParse({ ...baseRequest, parkingLatitude: 45.9, parkingLongitude: 4.1 }).success).toBe(true)
  })

  it('accepts indoor disciplines and requires an address for a gym', () => {
    const missingAddress = placeCreationInputSchema.safeParse({
      ...baseRequest,
      kind: 'salle',
      disciplines: ['bloc', 'speed'],
      rockType: '',
      rainExposure: '',
      sunlight: '',
      seasons: [],
      orientations: [],
    })

    expect(missingAddress.success).toBe(false)
    expect(placeCreationInputSchema.safeParse({
      ...baseRequest,
      kind: 'salle',
      disciplines: ['bloc', 'speed'],
      address: '10 rue du Bloc, 69001 Lyon',
      rockType: '',
      rainExposure: '',
      sunlight: '',
      seasons: [],
      orientations: [],
    }).success).toBe(true)
  })
})
