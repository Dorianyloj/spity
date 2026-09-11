export const cragRouteDisciplines = [
  'voie',
  'bloc',
  'grande_voie',
  'trad',
  'artif',
  'deep_water_solo',
  'via_ferrata',
] as const

export type CragRouteDiscipline = (typeof cragRouteDisciplines)[number]

export const cragRouteDisciplineLabels: Record<CragRouteDiscipline, string> = {
  voie: 'Voie',
  bloc: 'Bloc',
  grande_voie: 'Grande voie',
  trad: 'Trad',
  artif: 'Artif',
  deep_water_solo: 'Deep water solo',
  via_ferrata: 'Via ferrata',
}

export const getClimbingDisciplineLabel = (discipline: string) =>
  (cragRouteDisciplineLabels as Record<string, string>)[discipline]
    ?? (discipline === 'speed' ? 'Vitesse' : discipline)
