import { createFileRoute } from '@tanstack/react-router'
import { auth } from '@/src/services/better-auth/auth'

async function handleAuthRequest(request: Request, method: string) {
  try {
    return await auth.handler(request)
  } catch (error) {
    console.error(`[Auth ${method} Error]`, {
      url: request.url,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error ? error.cause : undefined,
      name: error instanceof Error ? error.name : undefined,
    })
    throw error
  }
}

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => handleAuthRequest(request, 'GET'),
      POST: ({ request }) => handleAuthRequest(request, 'POST'),
    },
  },
})
