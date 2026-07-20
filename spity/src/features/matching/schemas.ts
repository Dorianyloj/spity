import { z } from 'zod'
import { disciplinesEnum, gradeSchema } from '@/lib/validators'
import {
  availabilitySlotSchema,
  climbingEnvironmentSchema,
  partnerSearchSchema,
} from '@/features/profile/schemas'

export const partnershipStatusSchema = z.enum(['pending', 'accepted', 'declined'])

export const matchingFiltersSchema = z.object({
  query: z.string().trim().max(80).default(''),
  discipline: disciplinesEnum.optional(),
  grade: gradeSchema.optional(),
  availability: availabilitySlotSchema.optional(),
  environment: climbingEnvironmentSchema.optional(),
})

export const publicClimberSchema = z.object({
  userId: z.string().uuid(),
  displayName: z.string(),
  avatarUrl: z.string().url().nullable(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  climbingEnvironment: climbingEnvironmentSchema.nullable(),
  availability: z.array(availabilitySlotSchema),
  partnerSearch: partnerSearchSchema,
  goals: z.array(z.string()),
  disciplines: z.array(disciplinesEnum),
  niveaux: z.record(z.string(), z.string()),
  materiel: z.array(z.string()),
  karma: z.number(),
})

export const partnershipParticipantSchema = publicClimberSchema.pick({
  userId: true,
  displayName: true,
  avatarUrl: true,
  location: true,
  disciplines: true,
  niveaux: true,
})

export const partnershipRequestSchema = z.object({
  id: z.string().uuid(),
  senderId: z.string().uuid(),
  recipientId: z.string().uuid(),
  status: partnershipStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  respondedAt: z.string().datetime().nullable(),
  otherParticipant: partnershipParticipantSchema,
  direction: z.enum(['sent', 'received']),
})

export const createPartnershipBodySchema = z.object({
  recipientId: z.string().uuid('Identifiant du grimpeur invalide'),
})

export const updatePartnershipBodySchema = z.object({
  status: z.enum(['accepted', 'declined']),
})

export const partnershipResponseSchema = z.object({
  request: partnershipRequestSchema,
})

export const partnershipListResponseSchema = z.object({
  requests: z.array(partnershipRequestSchema),
})

export const matchingErrorResponseSchema = z.object({
  error: z.string(),
  issues: z.array(z.string()).optional(),
})

export type MatchingFilters = z.infer<typeof matchingFiltersSchema>
export type PublicClimber = z.infer<typeof publicClimberSchema>
export type PartnershipRequest = z.infer<typeof partnershipRequestSchema>
export type CreatePartnershipBody = z.infer<typeof createPartnershipBodySchema>
