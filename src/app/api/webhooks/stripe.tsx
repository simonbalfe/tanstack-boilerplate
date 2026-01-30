import { createFileRoute } from '@tanstack/react-router'
import Stripe from 'stripe'
import { processEvent } from '@/src/services/stripe/stripe-sync'
import env from '@/src/env'

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
})

export const Route = createFileRoute('/api/webhooks/stripe')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text()
        const signature = request.headers.get('Stripe-Signature')

        if (!signature) {
          return new Response(JSON.stringify({}), { status: 400 })
        }

        async function doEventProcessing() {
          if (typeof signature !== 'string') {
            throw new Error("[STRIPE HOOK] Header isn't a string???")
          }

          const event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET)
          const result = await processEvent(event)
          return result
        }

        const processingPromise = doEventProcessing()
        processingPromise.catch((e: unknown) => console.error('Stripe webhook error:', e))

        return new Response(JSON.stringify({ received: true }), {
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
