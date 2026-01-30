import { createFileRoute, redirect } from '@tanstack/react-router'
import { STRIPE_CUSTOMER_ID_KV } from '@/src/services/stripe/stripe-cache'
import { syncStripeDataToKV } from '@/src/services/stripe/stripe-sync'
import { auth } from '@/src/services/better-auth/auth'

export const Route = createFileRoute('/api/checkout/success')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await auth.api.getSession({
          headers: request.headers,
        })

        if (!session?.user) {
          return redirect({ to: '/auth' })
        }

        const stripeCustomerId = await STRIPE_CUSTOMER_ID_KV.get(session.user.id)

        if (!stripeCustomerId) {
          return redirect({ to: '/' })
        }

        await syncStripeDataToKV(stripeCustomerId as string)
        return redirect({ to: '/dashboard' })
      },
    },
  },
})
