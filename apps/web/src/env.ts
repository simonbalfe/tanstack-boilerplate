const env = {
  APP_URL: import.meta.env.VITE_APP_URL ?? 'http://localhost:3000',

  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '',
  STRIPE_PRICE_ID: import.meta.env.VITE_STRIPE_PRICE_ID ?? '',

  POSTHOG_KEY: import.meta.env.VITE_POSTHOG_KEY ?? '',
  POSTHOG_HOST: import.meta.env.VITE_POSTHOG_HOST ?? 'https://us.i.posthog.com',
}

export default env
