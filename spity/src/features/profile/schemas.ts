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
export type GrimpeurProfile = z.infer<typeof grimpeurProfileSchema>
export type ClubProfile = z.infer<typeof clubProfileSchema>
export type ProfileMeResponse = z.infer<typeof profileMeResponseSchema>
