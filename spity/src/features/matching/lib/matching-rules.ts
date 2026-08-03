import { partnerSearchSchema } from '@/features/profile/schemas'
import type { MatchingFilters, PublicClimber } from '../schemas'

const parseJson = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value
  }

  try {
    return JSON.parse(value) as unknown
  } catch {
    return value
  }
}

export const parseStringArray = (value: unknown) => {
  const parsedValue = parseJson(value)

  return Array.isArray(parsedValue)
    ? parsedValue.filter((item): item is string => typeof item === 'string')
    : []
}

export const parseStringRecord = (value: unknown) => {
  const parsedValue = parseJson(value)

  if (!parsedValue || typeof parsedValue !== 'object' || Array.isArray(parsedValue)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(parsedValue).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
  )
}

export const parsePartnerSearch = (value: unknown) => {
  const result = partnerSearchSchema.safeParse(parseJson(value))

  return result.success ? result.data : null
}

export const buildPartnershipPairKey = (firstUserId: string, secondUserId: string) => {
  return [firstUserId, secondUserId].sort().join(':')
}

export const filterClimbers = (climbers: PublicClimber[], filters: MatchingFilters) => {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase('fr')

  return climbers.filter((climber) => {
    const matchesQuery = normalizedQuery.length === 0 || [climber.displayName, climber.location ?? '']
      .join(' ')
      .toLocaleLowerCase('fr')
      .includes(normalizedQuery)
    const matchesDiscipline = !filters.discipline || climber.disciplines.includes(filters.discipline)
    const matchesGrade = !filters.grade || Object.values(climber.niveaux).includes(filters.grade)
    const matchesAvailability = !filters.availability || climber.availability.includes(filters.availability)
    const matchesEnvironment = !filters.environment || climber.climbingEnvironment === filters.environment

    return matchesQuery && matchesDiscipline && matchesGrade && matchesAvailability && matchesEnvironment
  })
}
