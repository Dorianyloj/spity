export const mapDisciplines = [
  'voie',
  'bloc',
  'grande_voie',
  'trad',
  'artif',
  'deep_water_solo',
  'via_ferrata',
  'speed',
] as const

export type MapDiscipline = (typeof mapDisciplines)[number]

export const mapDisciplineStyles: Record<MapDiscipline, { color: string; dotClassName: string; label: string }> = {
  voie: { color: '#2563eb', dotClassName: 'bg-blue-600', label: 'Voie' },
  bloc: { color: '#e11d48', dotClassName: 'bg-rose-600', label: 'Bloc' },
  grande_voie: { color: '#7c3aed', dotClassName: 'bg-violet-600', label: 'Grande voie' },
  trad: { color: '#ea580c', dotClassName: 'bg-orange-600', label: 'Trad' },
  artif: { color: '#a16207', dotClassName: 'bg-yellow-700', label: 'Artif' },
  deep_water_solo: { color: '#0891b2', dotClassName: 'bg-cyan-600', label: 'Deep water solo' },
  via_ferrata: { color: '#16a34a', dotClassName: 'bg-green-600', label: 'Via ferrata' },
  speed: { color: '#c026d3', dotClassName: 'bg-fuchsia-600', label: 'Vitesse' },
}

const isMapDiscipline = (value: string): value is MapDiscipline =>
  mapDisciplines.includes(value as MapDiscipline)

export const getMapDiscipline = (disciplines: string[], preferred?: string): MapDiscipline => {
  if (preferred && disciplines.includes(preferred) && isMapDiscipline(preferred)) {
    return preferred
  }

  return disciplines.find(isMapDiscipline) ?? 'voie'
}

export const getDominantMapDiscipline = (disciplines: MapDiscipline[]): MapDiscipline => {
  const counts = new Map<MapDiscipline, number>()

  disciplines.forEach((discipline) => counts.set(discipline, (counts.get(discipline) ?? 0) + 1))

  return disciplines.reduce((dominant, discipline) =>
    (counts.get(discipline) ?? 0) > (counts.get(dominant) ?? 0) ? discipline : dominant
  , disciplines[0] ?? 'voie')
}
