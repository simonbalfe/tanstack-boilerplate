import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import Stripe from 'stripe'
import env from '@/src/env'
import { STRIPE_CUSTOMER_ID_KV } from '../services/stripe/stripe-cache'
import { auth } from '@/src/services/better-auth/auth'

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
})

interface CheckoutRequestBody {
  userId: string
  email: string
  name?: string
  line_item: {
    price: string
    quantity: number
  }
}

export const createCheckoutSession = createServerFn({ method: 'POST' })
  .inputValidator((data: CheckoutRequestBody) => data)
  .handler(async ({ data: formData }) => {
    const { userId, email, line_item } = formData
    const request = getRequest()

    if (!userId) {
      throw new Error('User ID is required')
    }

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (session?.user.id !== userId) {
      return { success: false, error: 'Unauthorized' }
    }

    try {
      let stripeCustomerId = await STRIPE_CUSTOMER_ID_KV.get(userId)

      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email,
          metadata: { userId },
        })
        await STRIPE_CUSTOMER_ID_KV.set(userId, customer.id)
        stripeCustomerId = customer.id
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId as string,
        payment_method_types: ['card'],
        line_items: [
          {
            price: line_item.price,
            quantity: line_item.quantity,
          },
        ],
        mode: 'subscription',
        success_url: `${env.NEXT_PUBLIC_APP_URL}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.NEXT_PUBLIC_APP_URL}/`,
        subscription_data: {
          metadata: {
            userId: userId,
          },
        },
      })

      return { success: true, sessionId: checkoutSession.id }
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message }
      }
      return { success: false, error: 'An unknown error occurred' }
    }
  })
