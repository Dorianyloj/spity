import type { CreateUserEquipmentBody } from '../schemas'

type EquipmentCategory = CreateUserEquipmentBody['category']

const categoryKeywords: Array<{ category: EquipmentCategory; keywords: string[] }> = [
  { category: 'degaine', keywords: ['degaine', 'degaines', 'quickdraw', 'quickdraws'] },
  { category: 'mousqueton', keywords: ['mousqueton', 'mousquetons', 'karabiner', 'carabiner'] },
  { category: 'corde', keywords: ['corde', 'rope'] },
  { category: 'baudrier', keywords: ['baudrier', 'harnais', 'harness'] },
  { category: 'chaussons', keywords: ['chausson', 'chaussons', 'chaussures'] },
  { category: 'assureur', keywords: ['grigri', 'reverso', 'assureur', 'descendeur', 'atc'] },
  { category: 'casque', keywords: ['casque', 'helmet'] },
  { category: 'crashpad', keywords: ['crashpad', 'crash pad', 'pad'] },
  { category: 'longe', keywords: ['longe', 'vache'] },
  { category: 'sac', keywords: ['sac', 'sac a corde', 'rope bag'] },
]

const brandAliases: Array<{ brand: string; aliases: string[] }> = [
  { brand: 'Petzl', aliases: ['petzl'] },
  { brand: 'Black Diamond', aliases: ['black diamond', 'black diamonds', 'bd'] },
  { brand: 'Beal', aliases: ['beal', 'béal'] },
  { brand: 'Edelrid', aliases: ['edelrid'] },
  { brand: 'Mammut', aliases: ['mammut'] },
  { brand: 'Simond', aliases: ['simond'] },
  { brand: 'CAMP', aliases: ['camp'] },
  { brand: 'DMM', aliases: ['dmm'] },
  { brand: 'Wild Country', aliases: ['wild country'] },
  { brand: 'La Sportiva', aliases: ['la sportiva', 'sportiva'] },
  { brand: 'Scarpa', aliases: ['scarpa'] },
  { brand: 'Ocun', aliases: ['ocun', 'ocún'] },
  { brand: 'Grivel', aliases: ['grivel'] },
  { brand: 'Blue Ice', aliases: ['blue ice'] },
  { brand: 'Climbing Technology', aliases: ['climbing technology', 'ct'] },
]

const modelHints: Array<{ pattern: RegExp; brand: string; model: string; category: EquipmentCategory }> = [
  { pattern: /djinn\s+axess/i, brand: 'Petzl', model: 'Djinn Axess', category: 'degaine' },
  { pattern: /spirit\s+express/i, brand: 'Petzl', model: 'Spirit Express', category: 'degaine' },
  { pattern: /grigri/i, brand: 'Petzl', model: 'Grigri', category: 'assureur' },
  { pattern: /reverso/i, brand: 'Petzl', model: 'Reverso', category: 'assureur' },
  { pattern: /joker/i, brand: 'Beal', model: 'Joker', category: 'corde' },
  { pattern: /hotforge/i, brand: 'Black Diamond', model: 'HotForge', category: 'mousqueton' },
  { pattern: /atc/i, brand: 'Black Diamond', model: 'ATC', category: 'assureur' },
  { pattern: /corax/i, brand: 'Petzl', model: 'Corax', category: 'baudrier' },
]

const colors = [
  'turquoise',
  'bleu',
  'rouge',
  'vert',
  'jaune',
  'orange',
  'violet',
  'rose',
  'noir',
  'blanc',
  'gris',
  'argent',
  'doré',
]

const splitLines = (text: string) => {
  return text
    .split(/\n|;|,/)
    .map((line) => line.trim())
    .filter(Boolean)
}

const inferQuantity = (line: string) => {
  const quantityMatch = line.match(/^\s*(\d{1,3})\b/)

  return quantityMatch ? Number(quantityMatch[1]) : 1
}

const inferCategory = (line: string, hintedCategory: EquipmentCategory | null) => {
  if (hintedCategory) {
    return hintedCategory
  }

  const normalizedLine = line.toLowerCase()
  const match = categoryKeywords.find(({ keywords }) => keywords.some((keyword) => normalizedLine.includes(keyword)))

  return match?.category ?? 'autre'
}

const inferBrand = (line: string, hintedBrand: string | null) => {
  if (hintedBrand) {
    return hintedBrand
  }

  const normalizedLine = line.toLowerCase()
  const match = brandAliases.find(({ aliases }) => aliases.some((alias) => normalizedLine.includes(alias)))

  return match?.brand ?? null
}

const inferModelHint = (line: string) => {
  return modelHints.find(({ pattern }) => pattern.test(line)) ?? null
}

const inferColor = (line: string) => {
  const normalizedLine = line.toLowerCase()

  return colors.find((color) => normalizedLine.includes(color)) ?? null
}

const inferLengthMeters = (line: string) => {
  const lengthMatch = line.match(/\b(\d{2,3})\s*m\b/i)

  return lengthMatch ? Number(lengthMatch[1]) : null
}

const inferDiameterMm = (line: string) => {
  const diameterMatch = line.match(/\b(\d{1,2}(?:[.,]\d)?)\s*mm\b/i)

  return diameterMatch ? diameterMatch[1].replace(',', '.') : null
}

const inferSize = (line: string) => {
  const sizeMatch = line.match(/\b(?:taille|size)\s*([a-z0-9.+-]{1,8})\b/i)

  return sizeMatch ? sizeMatch[1].toUpperCase() : null
}

const buildModel = (line: string, category: EquipmentCategory, brand: string | null, hintedModel: string | null) => {
  if (hintedModel) {
    return hintedModel
  }

  const cleanedLine = line
    .replace(/^\s*\d{1,3}\s*/, '')
    .replace(/\b\d{1,3}\s*m\b/gi, '')
    .replace(/\b\d{1,2}(?:[.,]\d)?\s*mm\b/gi, '')
    .replace(/\b(?:taille|size)\s*[a-z0-9.+-]{1,8}\b/gi, '')
    .trim()

  const withoutBrand = brand ? cleanedLine.replace(new RegExp(brand.replace(/\s+/g, '\\s+'), 'i'), '').trim() : cleanedLine
  const withoutCategory = categoryKeywords
    .find((entry) => entry.category === category)
    ?.keywords.reduce((value, keyword) => value.replace(new RegExp(`\\b${keyword}\\b`, 'i'), '').trim(), withoutBrand)

  return withoutCategory && withoutCategory.length > 0 ? withoutCategory : 'Matériel à préciser'
}

export const parseEquipmentText = (text: string): CreateUserEquipmentBody[] => {
  return splitLines(text).map((line) => {
    const modelHint = inferModelHint(line)
    const category = inferCategory(line, modelHint?.category ?? null)
    const brand = inferBrand(line, modelHint?.brand ?? null)

    return {
      category,
      quantity: inferQuantity(line),
      brand,
      model: buildModel(line, category, brand, modelHint?.model ?? null),
      color: inferColor(line),
      size: inferSize(line),
      lengthMeters: inferLengthMeters(line),
      diameterMm: inferDiameterMm(line),
      condition: 'bon',
      availableForPartner: true,
      notes: line,
    }
  })
}
