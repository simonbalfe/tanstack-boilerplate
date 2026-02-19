import { app } from '@repo/api'
import { createFileRoute } from '@tanstack/react-router'

function handleRequest({ request }: { request: Request }) {
  return app.fetch(request)
}

export const Route = createFileRoute('/api/$')({
  server: {
    handlers: {
      GET: handleRequest,
      POST: handleRequest,
      PUT: handleRequest,
      PATCH: handleRequest,
      DELETE: handleRequest,
    },
  },
})
