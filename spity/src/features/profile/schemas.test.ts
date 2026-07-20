import {
  createUserEquipmentBodySchema,
  defaultPartnerSearch,
  parseEquipmentBodySchema,
  updatePublicProfileBodySchema,
} from './schemas'

describe('updatePublicProfileBodySchema', () => {
  const validProfile = {
    avatarUrl: '',
    displayName: '  Alex Martin  ',
    bio: '  ',
    location: 'Lyon',
    climbingEnvironment: 'mixed',
    availability: ['weekday_evening', 'weekend_morning'],
    partnerSearch: defaultPartnerSearch,
    goals: ['Progresser en voie'],
  }

  it('normalizes nullable profile fields', () => {
    expect(updatePublicProfileBodySchema.parse(validProfile)).toMatchObject({
      avatarUrl: null,
      displayName: 'Alex Martin',
      bio: null,
      location: 'Lyon',
      climbingEnvironment: 'mixed',
    })
  })

  it('normalizes an omitted climbing environment to null', () => {
    expect(updatePublicProfileBodySchema.parse({
      ...validProfile,
      climbingEnvironment: undefined,
    }).climbingEnvironment).toBeNull()
  })

  it('rejects more than six availability slots', () => {
    expect(updatePublicProfileBodySchema.safeParse({
      ...validProfile,
      availability: Array.from({ length: 7 }, () => 'weekday_evening'),
    }).success).toBe(false)
  })

  it('rejects an invalid avatar URL', () => {
    expect(updatePublicProfileBodySchema.safeParse({
      ...validProfile,
      avatarUrl: 'not-a-url',
    }).success).toBe(false)
  })
})

describe('equipment schemas', () => {
  const validEquipment = {
    category: 'corde',
    quantity: '2',
    brand: '  Beal ',
    model: ' Joker ',
    color: '',
    size: null,
    lengthMeters: '60',
    diameterMm: '9.1',
    condition: 'bon',
    availableForPartner: true,
    notes: undefined,
  }

  it('coerces form values and normalizes optional text', () => {
    expect(createUserEquipmentBodySchema.parse(validEquipment)).toEqual({
      category: 'corde',
      quantity: 2,
      brand: 'Beal',
      model: 'Joker',
      color: null,
      size: null,
      lengthMeters: 60,
      diameterMm: '9.1',
      condition: 'bon',
      availableForPartner: true,
      notes: null,
    })
  })

  it.each([0, 201, 1.5])('rejects invalid quantity %s', (quantity) => {
    expect(createUserEquipmentBodySchema.safeParse({
      ...validEquipment,
      quantity,
    }).success).toBe(false)
  })

  it('trims equipment parsing input', () => {
    expect(parseEquipmentBodySchema.parse({ text: '  corde 60 m  ' })).toEqual({ text: 'corde 60 m' })
  })

  it('rejects an empty equipment parsing input', () => {
    expect(parseEquipmentBodySchema.safeParse({ text: ' ' }).success).toBe(false)
  })
})
