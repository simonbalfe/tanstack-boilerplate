import { Hono } from 'hono'
import { optionalAuth } from '../middleware/auth'
import { getSubscriptionStatus } from '../services/subscription'

export const subscriptionRoutes = new Hono()

subscriptionRoutes.get('/subscription/check', optionalAuth, async (c) => {
  const session = c.get('session')

  if (!session?.user) {
    return c.json({ isSubscribed: false, tier: 'Free' })
  }

  const status = await getSubscriptionStatus(session.user.id)
  return c.json(status)
})
