import { z } from 'zod'
import { logger } from './logger'

const envSchema = z.object({
  DATABASE_URL: z.string().refine((val) => val.startsWith('mysql://'), {
    message: 'DATABASE_URL doit commencer par mysql://'
  }),
  JWT_SECRET: z.string().min(32, { message: 'JWT_SECRET doit contenir au moins 32 caractères' }),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

const getBuildEnvironment = () => {
  if (process.env.NEXT_PHASE !== 'phase-production-build') {
    return process.env
  }

  return {
    ...process.env,
    DATABASE_URL: process.env.DATABASE_URL ?? 'mysql://build:build@127.0.0.1:3306/build',
    JWT_SECRET: process.env.JWT_SECRET ?? 'build_only_secret_with_at_least_32_characters',
  }
}

const parseEnv = () => {
  try {
    return envSchema.parse(getBuildEnvironment())
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('config.environment_invalid', {
        issues: error.issues.map((issue: z.ZodIssue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      })
      throw new Error('Configuration d\'environnement invalide')
    }
    throw error
  }
}

export const env = parseEnv()
