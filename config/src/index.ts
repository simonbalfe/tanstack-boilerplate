import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadEnv } from 'dotenv'

const currentDir = dirname(fileURLToPath(import.meta.url))
const rootEnvPath = resolve(currentDir, '../../.env')

loadEnv(existsSync(rootEnvPath) ? { path: rootEnvPath } : undefined)

export const config = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? '',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? '',
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ?? '',
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ?? '',
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? '',
  RESEND_FROM: process.env.RESEND_FROM ?? '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? '',
  APP_URL: process.env.VITE_APP_URL ?? 'http://localhost:3000',
}

const mask = (v: string) => (v ? `${v.slice(0, 4)}***` : '(empty)')

console.log('[CONFIG] Env vars loaded:', {
  NODE_ENV: config.NODE_ENV,
  DATABASE_URL: mask(config.DATABASE_URL),
  BETTER_AUTH_SECRET: mask(config.BETTER_AUTH_SECRET),
  STRIPE_SECRET_KEY: mask(config.STRIPE_SECRET_KEY),
  STRIPE_WEBHOOK_SECRET: mask(config.STRIPE_WEBHOOK_SECRET),
  UPSTASH_REDIS_REST_URL: mask(config.UPSTASH_REDIS_REST_URL),
  UPSTASH_REDIS_REST_TOKEN: mask(config.UPSTASH_REDIS_REST_TOKEN),
  RESEND_API_KEY: mask(config.RESEND_API_KEY),
  RESEND_FROM: config.RESEND_FROM || '(empty)',
  GOOGLE_CLIENT_ID: mask(config.GOOGLE_CLIENT_ID),
  GOOGLE_CLIENT_SECRET: mask(config.GOOGLE_CLIENT_SECRET),
  APP_URL: config.APP_URL,
  envFilePath: rootEnvPath,
  envFileExists: existsSync(rootEnvPath),
})
