const serverEnv = {
    NODE_ENV: process.env.NODE_ENV ?? 'development',

    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? '',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? '',

    DATABASE_URL: process.env.DATABASE_URL ?? '',

    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ?? '',
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ?? '',

    RESEND_API_KEY: process.env.RESEND_API_KEY ?? '',
    RESEND_FROM: process.env.RESEND_FROM ?? '',

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? '',
}

const clientEnv = {
    APP_URL: import.meta.env.VITE_APP_URL ?? 'http://localhost:3000',

    STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '',
    STRIPE_PRICE_ID: import.meta.env.VITE_STRIPE_PRICE_ID ?? '',

    POSTHOG_KEY: import.meta.env.VITE_POSTHOG_KEY ?? '',
    POSTHOG_HOST: import.meta.env.VITE_POSTHOG_HOST ?? 'https://us.i.posthog.com',
}

const env = {
    ...serverEnv,
    ...clientEnv,
}

export default env;
