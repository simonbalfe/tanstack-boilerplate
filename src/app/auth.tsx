import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '@/src/components/pages/auth'

type AuthSearch = {
  callbackUrl?: string
}

export const Route = createFileRoute('/auth')({
  component: AuthPage,
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    callbackUrl: typeof search.callbackUrl === 'string' ? search.callbackUrl : undefined,
  }),
})
