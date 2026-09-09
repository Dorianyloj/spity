import { z } from 'zod'

export const adminQuerySchema = z.object({
  view: z.enum(['dashboard', 'accounts', 'posts', 'history']).catch('dashboard'),
  days: z.coerce.number().pipe(z.union([z.literal(7), z.literal(30), z.literal(90)])).catch(30),
  page: z.coerce.number().int().min(1).max(10000).catch(1),
  q: z.string().trim().max(100).catch(''),
  status: z.enum(['all', 'restricted', 'active']).catch('all'),
})
export type AdminQuery = z.infer<typeof adminQuerySchema>

export const moderationSchema = z.object({
  state: z.boolean(),
  reason: z.string().trim().min(8, 'Précisez le motif (8 caractères minimum).').max(500),
}).strict()
export const moderationTargetSchema = z.object({
  kind: z.enum(['users', 'posts']),
  id: z.uuid(),
})
export type ModerationTarget = z.infer<typeof moderationTargetSchema>

export const actionLabels = {
  admin_granted: 'Accès administrateur accordé',
  user_suspended: 'Compte suspendu',
  user_restored: 'Compte réactivé',
  post_hidden: 'Publication masquée',
  post_restored: 'Publication restaurée',
} as const

export function adminHref(query: Partial<AdminQuery>) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) params.set(key, String(value))
  return `/app/admin?${params}`
}
