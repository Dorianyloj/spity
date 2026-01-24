import type { Config } from 'drizzle-kit'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: '.env.local' })

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config
