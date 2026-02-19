import { Hono } from 'hono'
import { authRoutes } from './routes/auth'
import { checkoutRoutes } from './routes/checkout'
import { serverInfoRoutes } from './routes/server-info'
import { subscriptionRoutes } from './routes/subscription'
import { todoRoutes } from './routes/todos'
import { userRoutes } from './routes/users'
import { webhookRoutes } from './routes/webhooks'

export const app = new Hono().basePath('/api')

app.route('/', authRoutes)
app.route('/', checkoutRoutes)
app.route('/', subscriptionRoutes)
app.route('/', todoRoutes)
app.route('/', userRoutes)
app.route('/', webhookRoutes)
app.route('/', serverInfoRoutes)

export type AppRouter = typeof app
