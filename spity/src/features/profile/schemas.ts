import { z } from 'zod'
import { authUserSchema } from '@/features/auth/schemas'
import {
  createClubProfileSchema,
  createGrimpeurProfileSchema,
  disciplinesEnum,
  updateClubProfileSchema,
  updateGrimpeurProfileSchema,
} from '@/lib/validators'

export const createGrimpeurProfileBodySchema = createGrimpeurProfileSchema.omit({ userId: true })
export const updateGrimpeurProfileBodySchema = updateGrimpeurProfileSchema

export const createClubProfileBodySchema = createClubProfileSchema.omit({ userId: true })
export const updateClubProfileBodySchema = updateClubProfileSchema

export const equipmentCategorySchema = z.enum([
  'chaussons',
  'baudrier',
  'corde',
  'degaine',
  'mousqueton',
  'assureur',
  'casque',
  'crashpad',
  'longe',
  'sac',
  'autre',
])

export const equipmentConditionSchema = z.enum(['neuf', 'bon', 'use', 'a_verifier'])

const nullableTextSchema = (max: number) => z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value ?? null
  }

  const trimmedValue = value.trim()

  return trimmedValue.length > 0 ? trimmedValue : null
}, z.string().max(max).nullable())

const nullableIntegerSchema = (min: number, max: number) => z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  if (typeof value === 'string') {
    return Number(value)
  }

  return value
}, z.number().int().min(min).max(max).nullable())

export const createUserEquipmentBodySchema = z.object({
  category: equipmentCategorySchema,
  quantity: z.coerce.number().int().min(1, 'La quantité doit être au moins 1').max(200, 'Quantité trop élevée'),
  brand: nullableTextSchema(80),
  model: z.string().trim().min(1, 'Le modèle ou nom du matériel est requis').max(120),
  color: nullableTextSchema(60),
  size: nullableTextSchema(60),
  lengthMeters: nullableIntegerSchema(1, 200),
  diameterMm: nullableTextSchema(20),
  condition: equipmentConditionSchema,
  availableForPartner: z.boolean(),
  notes: nullableTextSchema(500),
})

export const updateUserEquipmentBodySchema = createUserEquipmentBodySchema.partial()

export const parseEquipmentBodySchema = z.object({
  text: z.string().trim().min(2, 'Ajoutez au moins une ligne de matériel').max(2000),
})

export const userEquipmentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  category: equipmentCategorySchema,
  quantity: z.number(),
  brand: z.string().nullable(),
  model: z.string(),
  color: z.string().nullable(),
  size: z.string().nullable(),
  lengthMeters: z.number().nullable(),
  diameterMm: z.string().nullable(),
  condition: equipmentConditionSchema,
  availableForPartner: z.boolean(),
  notes: z.string().nullable(),
})

export const equipmentListResponseSchema = z.object({
  equipment: z.array(userEquipmentSchema),
})

export const equipmentItemResponseSchema = z.object({
  equipment: userEquipmentSchema,
})

export const parseEquipmentResponseSchema = z.object({
  items: z.array(createUserEquipmentBodySchema),
})

export const grimpeurProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  disciplines: z.array(disciplinesEnum),
  niveaux: z.record(z.string(), z.string()),
  materiel: z.array(z.string()),
  karma: z.number().nullable(),
})

export const clubProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  nom: z.string(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  ffmeNum: z.string().nullable(),
})

export const profileMeResponseSchema = z.object({
  user: authUserSchema,
  grimpeurProfile: grimpeurProfileSchema.nullable(),
  clubProfile: clubProfileSchema.nullable(),
  equipment: z.array(userEquipmentSchema),
  onboardingComplete: z.boolean(),
})

export const profileErrorResponseSchema = z.object({
  error: z.string(),
  issues: z.array(z.string()).optional(),
})

export type CreateGrimpeurProfileBody = z.infer<typeof createGrimpeurProfileBodySchema>
export type UpdateGrimpeurProfileBody = z.infer<typeof updateGrimpeurProfileBodySchema>
export type CreateClubProfileBody = z.infer<typeof createClubProfileBodySchema>
export type UpdateClubProfileBody = z.infer<typeof updateClubProfileBodySchema>
export type CreateUserEquipmentBody = z.infer<typeof createUserEquipmentBodySchema>
export type UpdateUserEquipmentBody = z.infer<typeof updateUserEquipmentBodySchema>
export type GrimpeurProfile = z.infer<typeof grimpeurProfileSchema>
export type ClubProfile = z.infer<typeof clubProfileSchema>
export type UserEquipment = z.infer<typeof userEquipmentSchema>
export type ProfileMeResponse = z.infer<typeof profileMeResponseSchema>
