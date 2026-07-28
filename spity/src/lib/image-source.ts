import { z } from 'zod'

export const imageSourceSchema = z.union([
  z.string().url().refine(
    (value) => value.startsWith('http://') || value.startsWith('https://'),
    'La source externe doit utiliser HTTP ou HTTPS'
  ),
  z.string().startsWith('/'),
])
