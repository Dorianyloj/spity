import { parseEquipmentText } from './equipment-parser'

describe('parseEquipmentText', () => {
  it('returns no item for an empty input', () => {
    expect(parseEquipmentText('  \n ; , ')).toEqual([])
  })

  it('recognizes a known quickdraw model and its attributes', () => {
    expect(parseEquipmentText('2 Petzl Djinn Axess rouges')).toEqual([
      expect.objectContaining({
        category: 'degaine',
        quantity: 2,
        brand: 'Petzl',
        model: 'Djinn Axess',
        color: 'rouge',
        condition: 'bon',
        availableForPartner: true,
      }),
    ])
  })

  it('extracts rope length and decimal diameter', () => {
    const [rope] = parseEquipmentText('Beal Joker corde 60 m 9,1 mm turquoise')

    expect(rope).toMatchObject({
      category: 'corde',
      brand: 'Beal',
      model: 'Joker',
      color: 'turquoise',
      lengthMeters: 60,
      diameterMm: '9.1',
    })
  })

  it('extracts a size and aliases for a harness', () => {
    const [harness] = parseEquipmentText('Petzl harnais Corax taille m bleu')

    expect(harness).toMatchObject({
      category: 'baudrier',
      brand: 'Petzl',
      model: 'Corax',
      color: 'bleu',
      size: 'M',
    })
  })

  it('splits newline, semicolon and comma separated equipment', () => {
    const equipment = parseEquipmentText('Grigri; casque Mammut\ncrash pad Ocun, longe')

    expect(equipment).toHaveLength(4)
    expect(equipment.map(({ category }) => category)).toEqual([
      'assureur',
      'casque',
      'crashpad',
      'longe',
    ])
  })

  it('falls back to the other category while preserving the source text', () => {
    expect(parseEquipmentText('Brosse artisanale')).toEqual([
      expect.objectContaining({
        category: 'autre',
        quantity: 1,
        brand: null,
        model: 'Brosse artisanale',
        notes: 'Brosse artisanale',
      }),
    ])
  })

  it('uses a placeholder when only technical rope attributes remain', () => {
    const [rope] = parseEquipmentText('corde 80m 10mm')

    expect(rope).toMatchObject({
      model: 'Matériel à préciser',
      lengthMeters: 80,
      diameterMm: '10',
    })
  })
})
