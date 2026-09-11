import {
  getDominantMapDiscipline,
  getMapDiscipline,
  mapDisciplines,
  mapDisciplineStyles,
} from './map-marker-styles'

describe('place map marker styles', () => {
  it('assigns a distinct color to every climbing practice', () => {
    const colors = mapDisciplines.map((discipline) => mapDisciplineStyles[discipline].color)

    expect(new Set(colors).size).toBe(mapDisciplines.length)
  })

  it('uses the filtered practice when a place supports several', () => {
    expect(getMapDiscipline(['bloc', 'voie'], 'voie')).toBe('voie')
    expect(getMapDiscipline(['bloc', 'voie'])).toBe('bloc')
  })

  it('colors a group with its most common practice', () => {
    expect(getDominantMapDiscipline(['voie', 'bloc', 'voie'])).toBe('voie')
  })
})
