import { z } from 'zod'
import { registerSchema } from '@/lib/validators'

export const registrationFormSchema = registerSchema
  .extend({
    confirmPassword: z.string().min(1, 'Confirmez votre mot de passe'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

export type RegistrationFormInput = z.infer<typeof registrationFormSchema>
