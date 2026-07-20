import { z } from 'zod'

export const eventTypeSchema = z.enum(['outing', 'contest', 'coaching', 'initiation'])
export const eventStatusSchema = z.enum(['scheduled', 'cancelled'])
export const registrationStatusSchema = z.enum(['active', 'cancelled'])

const nullableText = (max: number) => z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value ?? null
  }

  const trimmedValue = value.trim()

  return trimmedValue.length > 0 ? trimmedValue : null
}, z.string().max(max).nullable())

const nullableDateTime = z.preprocess((value) => value === '' ? null : value, z.string().datetime().nullable())

export const createEventBodySchema = z.object({
  title: z.string().trim().min(3, 'Le titre doit contenir au moins 3 caractères').max(255),
  type: eventTypeSchema,
  description: nullableText(1000),
  location: z.string().trim().min(2, 'La localisation est requise').max(255),
  startsAt: z.string().datetime('Date de début invalide'),
  endsAt: nullableDateTime,
  capacity: z.number().int().min(1, 'La capacité minimale est 1').max(1000, 'La capacité maximale est 1000'),
}).superRefine((event, context) => {
  if (event.endsAt && new Date(event.endsAt) <= new Date(event.startsAt)) {
    context.addIssue({
      code: 'custom',
      path: ['endsAt'],
      message: 'La fin doit être postérieure au début',
    })
  }
})

export const eventFormSchema = z.object({
  title: z.string().trim().min(3, 'Le titre doit contenir au moins 3 caractères').max(255),
  type: eventTypeSchema,
  description: z.string().trim().max(1000),
  location: z.string().trim().min(2, 'La localisation est requise').max(255),
  startsAt: z.string()
    .min(1, 'La date de début est requise')
    .refine((value) => !Number.isNaN(new Date(value).getTime()), 'Date de début invalide'),
  endsAt: z.string().refine(
    (value) => value.length === 0 || !Number.isNaN(new Date(value).getTime()),
    'Date de fin invalide'
  ),
  capacity: z.number().int().min(1, 'La capacité minimale est 1').max(1000, 'La capacité maximale est 1000'),
}).superRefine((event, context) => {
  if (event.endsAt && new Date(event.endsAt) <= new Date(event.startsAt)) {
    context.addIssue({
      code: 'custom',
      path: ['endsAt'],
      message: 'La fin doit être postérieure au début',
    })
  }
})

export const updateEventBodySchema = z.object({
  title: z.string().trim().min(3).max(255).optional(),
  type: eventTypeSchema.optional(),
  description: nullableText(1000).optional(),
  location: z.string().trim().min(2).max(255).optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: nullableDateTime.optional(),
  capacity: z.number().int().min(1).max(1000).optional(),
  status: z.literal('cancelled').optional(),
}).refine((event) => Object.keys(event).length > 0, {
  message: 'Au moins une modification est requise',
})

export const eventParticipantSchema = z.object({
  userId: z.string().uuid(),
  displayName: z.string(),
  avatarUrl: z.string().url().nullable(),
})

export const eventSchema = z.object({
  id: z.string().uuid(),
  clubId: z.string().uuid(),
  clubName: z.string(),
  title: z.string(),
  type: eventTypeSchema,
  description: z.string().nullable(),
  location: z.string().nullable(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().nullable(),
  capacity: z.number().int(),
  status: eventStatusSchema,
  registeredCount: z.number().int(),
  remainingCapacity: z.number().int(),
  isRegistered: z.boolean(),
  isOwner: z.boolean(),
  participants: z.array(eventParticipantSchema),
})

export const eventResponseSchema = z.object({ event: eventSchema })
export const eventListResponseSchema = z.object({ events: z.array(eventSchema) })
export const eventErrorResponseSchema = z.object({
  error: z.string(),
  issues: z.array(z.string()).optional(),
})

export type CreateEventBody = z.infer<typeof createEventBodySchema>
export type UpdateEventBody = z.infer<typeof updateEventBodySchema>
export type EventFormValues = z.infer<typeof eventFormSchema>
export type SpityEvent = z.infer<typeof eventSchema>
