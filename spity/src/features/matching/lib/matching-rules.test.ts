import type { PublicClimber } from '../schemas'
import {
  buildPartnershipPairKey,
  filterClimbers,
  parsePartnerSearch,
  parseStringArray,
  parseStringRecord,
} from './matching-rules'

const climber = (overrides: Partial<PublicClimber> = {}): PublicClimber => ({
  userId: '11111111-1111-4111-8111-111111111111',
  displayName: 'Lina Martin',
  avatarUrl: null,
  bio: null,
  location: 'Lyon',
  climbingEnvironment: 'mixed',
  availability: ['weekday_evening'],
  partnerSearch: {
    enabled: true,
    levelPreference: 'same_or_close',
    style: 'training',
    notes: null,
  },
  goals: [],
  disciplines: ['bloc', 'voie'],
  niveaux: { bloc: '6b' },
  materiel: ['chaussons'],
  karma: 10,
  ...overrides,
})

describe('matching rules', () => {
  it('construit la même clé quelle que soit la direction de la demande', () => {
    expect(buildPartnershipPairKey('user-b', 'user-a')).toBe('user-a:user-b')
    expect(buildPartnershipPairKey('user-a', 'user-b')).toBe('user-a:user-b')
  })

  it('parse les structures JSON stockées par MariaDB', () => {
    expect(parseStringArray('["bloc","voie",2]')).toEqual(['bloc', 'voie'])
    expect(parseStringRecord('{"bloc":"6b","invalid":3}')).toEqual({ bloc: '6b' })
  })

  it('retourne des structures vides pour un JSON invalide', () => {
    expect(parseStringArray('{invalid')).toEqual([])
    expect(parseStringRecord(null)).toEqual({})
  })

  it('valide les préférences de recherche', () => {
    expect(parsePartnerSearch(JSON.stringify({
      enabled: true,
      levelPreference: 'any',
      style: 'relaxed',
      notes: null,
    }))).toMatchObject({ enabled: true, levelPreference: 'any' })
    expect(parsePartnerSearch({ enabled: 'yes' })).toBeNull()
  })

  it('filtre par nom ou localisation sans tenir compte de la casse', () => {
    const climbers = [climber(), climber({ userId: '22222222-2222-4222-8222-222222222222', displayName: 'Nassim', location: 'Grenoble' })]

    expect(filterClimbers(climbers, { query: 'LYON' })).toHaveLength(1)
    expect(filterClimbers(climbers, { query: 'nassim' })[0]?.displayName).toBe('Nassim')
  })

  it('combine discipline, disponibilité et environnement', () => {
    const climbers = [
      climber(),
      climber({
        userId: '22222222-2222-4222-8222-222222222222',
        disciplines: ['trad'],
        niveaux: { trad: '5c' },
        availability: ['weekend_morning'],
        climbingEnvironment: 'outdoor',
      }),
    ]

    expect(filterClimbers(climbers, {
      query: '',
      discipline: 'trad',
      grade: '5c',
      availability: 'weekend_morning',
      environment: 'outdoor',
    })).toHaveLength(1)
  })
})
