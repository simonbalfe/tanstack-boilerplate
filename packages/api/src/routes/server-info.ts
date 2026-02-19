import { Hono } from 'hono'
import { optionalAuth } from '../middleware/auth'

export const serverInfoRoutes = new Hono()

serverInfoRoutes.get('/server-info', optionalAuth, async (c) => {
  const session = c.get('session')

  return c.json({
    serverTime: new Date().toISOString(),
    userAgent: c.req.header('user-agent') ?? 'Unknown',
    isAuthenticated: !!session?.user,
    userName: session?.user?.name ?? null,
  })
})
