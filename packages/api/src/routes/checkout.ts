import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth'
import { createCheckoutSession, handleCheckoutSuccess } from '../services/checkout'

export const checkoutRoutes = new Hono()

checkoutRoutes.post('/checkout/session', requireAuth, async (c) => {
  const body = await c.req.json()
  const { userId, email, line_item } = body

  if (!userId) {
    return c.json({ success: false, error: 'User ID is required' }, 400)
  }

  const session = c.get('session')
  if (session.user.id !== userId) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  try {
    const sessionId = await createCheckoutSession(userId, email, line_item)
    return c.json({ success: true, sessionId })
  } catch (error) {
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      },
      500,
    )
  }
})

checkoutRoutes.get('/checkout/success', requireAuth, async (c) => {
  const session = c.get('session')
  const destination = await handleCheckoutSuccess(session.user.id)
  return c.redirect(destination === 'dashboard' ? '/dashboard' : '/')
})
