import env from '@/src/env'
import { authClient } from '@shared/lib/auth-client'
import { loadStripe } from '@stripe/stripe-js'
import { useMutation } from '@tanstack/react-query'

const stripePromise = loadStripe(env.STRIPE_PUBLISHABLE_KEY)

async function createCheckoutSession(userId: string, priceId?: string | null) {
  const session = await authClient.getSession()
  const email = session.data?.user.email ?? ''
  const name = session.data?.user.name ?? ''

  const res = await fetch('/api/checkout/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      email,
      name,
      line_item: {
        price: priceId ?? env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    }),
  })
  const result = await res.json()

  if (!result.sessionId) {
    throw new Error(result.error ?? 'Checkout session creation failed')
  }

  const stripe = await stripePromise
  if (!stripe) {
    throw new Error('Stripe failed to initialize')
  }

  const { error } = await stripe.redirectToCheckout({
    sessionId: result.sessionId,
  })
  if (error) {
    throw new Error(error.message)
  }
}

export const useCheckout = (userId: string | undefined, priceId?: string | null) => {
  const mutation = useMutation({
    mutationFn: () => {
      if (!userId) {
        return Promise.reject(new Error('User ID is required'))
      }
      return createCheckoutSession(userId, priceId)
    },
  })

  return {
    handleCheckout: () => mutation.mutate(),
    isLoading: mutation.isPending,
  }
}
