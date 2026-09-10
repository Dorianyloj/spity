import { placeChangeInputSchema, placeCreationInputSchema } from './schemas'

const baseRequest = {
  kind: 'falaise' as const,
  name: 'Roche Corbière',
  photoMediaId: null,
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

  it('accepts an uploaded photo ID and rejects malformed IDs', () => {
    expect(placeCreationInputSchema.safeParse({
      ...baseRequest,
      photoMediaId: 'eb7c2638-3114-41b6-8917-a5dc4bc1d22e',
    }).success).toBe(true)
    expect(placeCreationInputSchema.safeParse({ ...baseRequest, photoMediaId: '../photo' }).success).toBe(false)
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

describe('placeChangeInputSchema', () => {
  const baseChange = {
    kind: 'falaise' as const,
    placeId: 'eb7c2638-3114-41b6-8917-a5dc4bc1d22e',
    message: 'Parking déplacé après les travaux.',
    photoMediaIds: ['11111111-1111-4111-8111-111111111111'],
    name: 'Roche Corbière',
    city: 'Exemple-sur-Roche',
    department: 'Rhône',
    region: 'Auvergne-Rhône-Alpes',
    latitude: 45.9,
    longitude: 4.1,
    restrictions: '',
    sourceUrl: '',
    notes: '',
    disciplines: ['voie'] as const,
    rockType: 'calcaire' as const,
    rainExposure: 'expose' as const,
    sunlight: 'mixte' as const,
    levels: '5c, 6a',
    orientation: 'sud' as const,
    orientations: ['sud'] as const,
    seasons: ['printemps'] as const,
    status: 'sec' as const,
    access: 'Suivre le sentier.',
    approach: '15 min',
    parking: 'Parking du col',
    parkingLatitude: 45.91,
    parkingLongitude: 4.11,
  }

  it('accepts a full correction with several photos', () => {
    expect(placeChangeInputSchema.safeParse({
      ...baseChange,
      photoMediaIds: [
        '11111111-1111-4111-8111-111111111111',
        '22222222-2222-4222-8222-222222222222',
      ],
    }).success).toBe(true)
  })

  it('requires complete coordinate pairs and limits the gallery request', () => {
    expect(placeChangeInputSchema.safeParse({ ...baseChange, parkingLongitude: null }).success).toBe(false)
    expect(placeChangeInputSchema.safeParse({
      ...baseChange,
      photoMediaIds: Array.from({ length: 7 }, (_, index) => `11111111-1111-4111-8111-${String(index).padStart(12, '0')}`),
    }).success).toBe(false)
  })
})
