import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'
import { env } from '@/lib/env'

const globalForDatabase = globalThis as typeof globalThis & {
  spityMysqlPool?: mysql.Pool
}

const pool = globalForDatabase.spityMysqlPool ?? mysql.createPool(env.DATABASE_URL)

globalForDatabase.spityMysqlPool = pool

export const db = drizzle(pool, { schema, mode: 'default' })
