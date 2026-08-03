import { z } from 'zod'

export const healthResponseSchema = z.object({
  status: z.enum(['ok', 'unavailable']),
  version: z.string().regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/),
  revision: z.string().min(7).max(64),
})
