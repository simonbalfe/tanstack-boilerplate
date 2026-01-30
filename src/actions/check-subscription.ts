import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '@/src/services/better-auth/auth'
import { STRIPE_CACHE_KV, STRIPE_CUSTOMER_ID_KV } from '../services/stripe/stripe-cache'

async function getStripeSubByUserId(userId: string) {
  const stripeCustomerId = await STRIPE_CUSTOMER_ID_KV.get(userId)

  if (!stripeCustomerId) return null

  return STRIPE_CACHE_KV.get(stripeCustomerId as string)
}

export const checkSubscription = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()

  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session?.user) {
    return { isSubscribed: false, tier: 'Free' }
  }

  const stripeSub = await getStripeSubByUserId(session.user.id)
  const isSubscribed = stripeSub?.status === 'active' || stripeSub?.status === 'trialing'

  return {
    isSubscribed,
    tier: isSubscribed ? 'Pro' : 'Free',
  }
})
