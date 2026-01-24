import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().refine((val) => val.startsWith('mysql://'), {
    message: 'DATABASE_URL doit commencer par mysql://'
  }),
  JWT_SECRET: z.string().min(32, { message: 'JWT_SECRET doit contenir au moins 32 caractères' }),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

const parseEnv = () => {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Variables d\'environnement invalides:')
      error.issues.forEach((issue: z.ZodIssue) => {
        console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
      })
      throw new Error('Configuration d\'environnement invalide')
    }
    throw error
  }
}

export const env = parseEnv()
