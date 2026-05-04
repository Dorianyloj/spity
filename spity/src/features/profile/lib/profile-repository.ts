import { and, eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import { db } from '@/db'
import { clubProfiles, grimpeurProfiles, userEquipment } from '@/db/schema'
import {
  clubProfileSchema,
  grimpeurProfileSchema,
  userEquipmentSchema,
  type ClubProfile,
  type CreateClubProfileBody,
  type CreateGrimpeurProfileBody,
  type CreateUserEquipmentBody,
  type GrimpeurProfile,
  type UpdateClubProfileBody,
  type UpdateGrimpeurProfileBody,
  type UpdateUserEquipmentBody,
  type UserEquipment,
} from '../schemas'

type GrimpeurProfileRow = typeof grimpeurProfiles.$inferSelect
type ClubProfileRow = typeof clubProfiles.$inferSelect
type UserEquipmentRow = typeof userEquipment.$inferSelect

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

const toUserEquipment = (equipment: UserEquipmentRow): UserEquipment => {
  return userEquipmentSchema.parse({
    id: equipment.id,
    userId: equipment.userId,
    category: equipment.category,
    quantity: equipment.quantity,
    brand: equipment.brand,
    model: equipment.model,
    color: equipment.color,
    size: equipment.size,
    lengthMeters: equipment.lengthMeters,
    diameterMm: equipment.diameterMm,
    condition: equipment.condition,
    availableForPartner: Boolean(equipment.availableForPartner),
    notes: equipment.notes,
  })
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

export const findUserEquipmentByUserId = async (userId: string) => {
  const equipment = await db.select().from(userEquipment).where(eq(userEquipment.userId, userId))

  return equipment.map(toUserEquipment)
}

export const findUserEquipmentItem = async (userId: string, equipmentId: string) => {
  const [equipment] = await db
    .select()
    .from(userEquipment)
    .where(and(eq(userEquipment.userId, userId), eq(userEquipment.id, equipmentId)))
    .limit(1)

  return equipment ? toUserEquipment(equipment) : null
}

export const createUserEquipment = async (userId: string, values: CreateUserEquipmentBody) => {
  const equipmentId = randomUUID()

  await db.insert(userEquipment).values({
    id: equipmentId,
    userId,
    ...values,
  })

  return findUserEquipmentItem(userId, equipmentId)
}

export const updateUserEquipment = async (userId: string, equipmentId: string, values: UpdateUserEquipmentBody) => {
  await db
    .update(userEquipment)
    .set(values)
    .where(and(eq(userEquipment.userId, userId), eq(userEquipment.id, equipmentId)))

  return findUserEquipmentItem(userId, equipmentId)
}

export const deleteUserEquipment = async (userId: string, equipmentId: string) => {
  await db
    .delete(userEquipment)
    .where(and(eq(userEquipment.userId, userId), eq(userEquipment.id, equipmentId)))
}
