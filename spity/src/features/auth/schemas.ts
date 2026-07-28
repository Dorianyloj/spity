import { z } from 'zod'
import { imageSourceSchema } from '@/lib/image-source'

export const authRoleSchema = z.enum(['grimpeur', 'club'])

export const authUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: authRoleSchema,
  avatarUrl: imageSourceSchema.nullable(),
  emailVerified: z.boolean(),
})

export const authSuccessResponseSchema = z.object({
  user: authUserSchema,
})

export const authStatusResponseSchema = z.object({
  authenticated: z.boolean(),
  user: authUserSchema.nullable(),
})

export const authMessageResponseSchema = z.object({
  message: z.string(),
})

export const authErrorResponseSchema = z.object({
  error: z.string(),
  issues: z.array(z.string()).optional(),
})

export const sessionPayloadSchema = z.object({
  sub: z.string().uuid(),
  email: z.string().email(),
  role: authRoleSchema,
  iat: z.number().int().positive(),
  exp: z.number().int().positive(),
})

export type AuthRole = z.infer<typeof authRoleSchema>
export type AuthUser = z.infer<typeof authUserSchema>
export type SessionPayload = z.infer<typeof sessionPayloadSchema>
