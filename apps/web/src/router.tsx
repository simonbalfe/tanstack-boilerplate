import * as Sentry from '@sentry/tanstackstart-react'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultErrorComponent: ({ error }) => {
      console.error('[Router Error]', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
        cause: error?.cause,
      })
      return (
        <div className="p-4">
          <h1 className="text-xl font-bold text-red-600">Something went wrong</h1>
          <pre className="mt-2 text-sm text-gray-600">{error?.message}</pre>
        </div>
      )
    },
  })

  if (!router.isServer && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
      tracesSampleRate: 0,
    })
  }

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
