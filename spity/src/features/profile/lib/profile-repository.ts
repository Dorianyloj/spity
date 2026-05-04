import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import { db } from '@/db'
import { clubProfiles, grimpeurProfiles } from '@/db/schema'
import {
  clubProfileSchema,
  grimpeurProfileSchema,
  type ClubProfile,
  type CreateClubProfileBody,
  type CreateGrimpeurProfileBody,
  type GrimpeurProfile,
  type UpdateClubProfileBody,
  type UpdateGrimpeurProfileBody,
} from '../schemas'

type GrimpeurProfileRow = typeof grimpeurProfiles.$inferSelect
type ClubProfileRow = typeof clubProfiles.$inferSelect

const parseStoredJson = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value
  }

  try {
    return JSON.parse(value) as unknown
  } catch {
    return value
  }
}

const toGrimpeurProfile = (profile: GrimpeurProfileRow): GrimpeurProfile => {
  return grimpeurProfileSchema.parse({
    ...profile,
    disciplines: parseStoredJson(profile.disciplines),
    niveaux: parseStoredJson(profile.niveaux),
    materiel: parseStoredJson(profile.materiel),
  })
}

const toClubProfile = (profile: ClubProfileRow): ClubProfile => {
  return clubProfileSchema.parse(profile)
}

export const findGrimpeurProfileByUserId = async (userId: string) => {
  const [profile] = await db.select().from(grimpeurProfiles).where(eq(grimpeurProfiles.userId, userId)).limit(1)

  return profile ? toGrimpeurProfile(profile) : null
}

export const findClubProfileByUserId = async (userId: string) => {
  const [profile] = await db.select().from(clubProfiles).where(eq(clubProfiles.userId, userId)).limit(1)

  return profile ? toClubProfile(profile) : null
}

export const createGrimpeurProfile = async (userId: string, values: CreateGrimpeurProfileBody) => {
  const profileId = randomUUID()

  await db.insert(grimpeurProfiles).values({
    id: profileId,
    userId,
    disciplines: values.disciplines,
    niveaux: values.niveaux,
    materiel: values.materiel,
  })

  return findGrimpeurProfileByUserId(userId)
}

export const updateGrimpeurProfile = async (userId: string, values: UpdateGrimpeurProfileBody) => {
  await db.update(grimpeurProfiles).set(values).where(eq(grimpeurProfiles.userId, userId))

  return findGrimpeurProfileByUserId(userId)
}

export const createClubProfile = async (userId: string, values: CreateClubProfileBody) => {
  const profileId = randomUUID()

  await db.insert(clubProfiles).values({
    id: profileId,
    userId,
    nom: values.nom,
    bio: values.bio,
    location: values.location,
    ffmeNum: values.ffmeNum,
  })

  return findClubProfileByUserId(userId)
}

export const updateClubProfile = async (userId: string, values: UpdateClubProfileBody) => {
  await db.update(clubProfiles).set(values).where(eq(clubProfiles.userId, userId))

  return findClubProfileByUserId(userId)
}
