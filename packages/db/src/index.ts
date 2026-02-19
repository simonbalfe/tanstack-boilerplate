import { neon } from '@neondatabase/serverless'
import { config } from '@repo/config'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const sql = neon(config.DATABASE_URL)
export const db = drizzle(sql, { schema })
