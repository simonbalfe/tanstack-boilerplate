import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadEnv } from 'dotenv'
import { z } from 'zod'

const currentDir = dirname(fileURLToPath(import.meta.url))
const rootEnvPath = resolve(currentDir, '../../.env')

loadEnv(existsSync(rootEnvPath) ? { path: rootEnvPath } : undefined)

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  UPSTASH_REDIS_REST_URL: z.string().min(1).optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM: z.string().min(1).optional(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  VITE_APP_URL: z.url(),
  SENTRY_DSN: z.string().min(1).optional(),
  SENTRY_AUTH_TOKEN: z.string().min(1).optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1).optional(),
})

const parsed = serverEnvSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('[CONFIG] Invalid environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

const env = parsed.data

export const config = {
  NODE_ENV: env.NODE_ENV,
  DATABASE_URL: env.DATABASE_URL,
  BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET,
  STRIPE_SECRET_KEY: env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: env.STRIPE_WEBHOOK_SECRET,
  UPSTASH_REDIS_REST_URL: env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: env.UPSTASH_REDIS_REST_TOKEN,
  RESEND_API_KEY: env.RESEND_API_KEY,
  RESEND_FROM: env.RESEND_FROM,
  GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
  APP_URL: env.VITE_APP_URL,
  SENTRY_DSN: env.SENTRY_DSN,
  SENTRY_AUTH_TOKEN: env.SENTRY_AUTH_TOKEN,
  POSTHOG_KEY: env.NEXT_PUBLIC_POSTHOG_KEY,
  POSTHOG_HOST: env.NEXT_PUBLIC_POSTHOG_HOST,
}

const mask = (v: string) => (v ? `${v.slice(0, 4)}***` : '(empty)')

const optionalMask = (v: string | undefined) => (v ? `${v.slice(0, 4)}***` : '(not set)')

console.log('[CONFIG] Env vars loaded:', {
  NODE_ENV: config.NODE_ENV,
  DATABASE_URL: mask(config.DATABASE_URL),
  BETTER_AUTH_SECRET: mask(config.BETTER_AUTH_SECRET),
  STRIPE_SECRET_KEY: optionalMask(config.STRIPE_SECRET_KEY),
  STRIPE_WEBHOOK_SECRET: optionalMask(config.STRIPE_WEBHOOK_SECRET),
  UPSTASH_REDIS_REST_URL: optionalMask(config.UPSTASH_REDIS_REST_URL),
  UPSTASH_REDIS_REST_TOKEN: optionalMask(config.UPSTASH_REDIS_REST_TOKEN),
  RESEND_API_KEY: optionalMask(config.RESEND_API_KEY),
  RESEND_FROM: config.RESEND_FROM || '(not set)',
  GOOGLE_CLIENT_ID: mask(config.GOOGLE_CLIENT_ID),
  GOOGLE_CLIENT_SECRET: mask(config.GOOGLE_CLIENT_SECRET),
  APP_URL: config.APP_URL,
  SENTRY_DSN: optionalMask(config.SENTRY_DSN),
  POSTHOG_KEY: optionalMask(config.POSTHOG_KEY),
  envFilePath: rootEnvPath,
  envFileExists: existsSync(rootEnvPath),
})
