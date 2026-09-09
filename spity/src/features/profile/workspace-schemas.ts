import { z } from 'zod'
import { disciplinesEnum, gradeSchema } from '@/lib/validators'
import { availabilitySlotSchema, climbingEnvironmentSchema, partnerSearchSchema } from './schemas'

const text = (max: number) => z.string().trim().max(max).nullable()
export const profileSettingsSchema = z.discriminatedUnion('section', [
  z.object({ section: z.literal('identity'), displayName: z.string().trim().min(2, 'Choisis un nom de 2 à 80 caractères.').max(80), bio: text(500), location: text(255), avatarMediaId: z.string().uuid().nullable().optional() }).strict(),
  z.object({ section: z.literal('practice'), disciplines: z.array(disciplinesEnum).min(1, 'Choisis au moins une discipline.').max(7), niveaux: z.partialRecord(disciplinesEnum, gradeSchema), climbingEnvironment: climbingEnvironmentSchema.nullable(), goals: z.array(z.string().trim().min(1).max(80)).max(8) }).strict(),
  z.object({ section: z.literal('partners'), availability: z.array(availabilitySlotSchema).max(6), partnerSearch: partnerSearchSchema.strict() }).strict(),
]).superRefine((value, ctx) => {
  if (value.section === 'practice') {
    for (const discipline of value.disciplines) {
      if (!value.niveaux[discipline]) ctx.addIssue({ code: 'custom', path: ['niveaux', discipline], message: 'Renseigne le niveau de chaque discipline cochée.' })
    }
  }
})
export type ProfileSettings = z.infer<typeof profileSettingsSchema>
export const createProfilePostSchema = z.object({
  content: z.string().trim().min(1, 'Ajoute quelques mots pour raconter ta session.').max(500),
  cotation: gradeSchema.nullable(),
  mediaId: z.string().uuid().nullable().optional(),
}).strict()
export type CreateProfilePost = z.infer<typeof createProfilePostSchema>
