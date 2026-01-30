import { createFileRoute } from '@tanstack/react-router'
import { ResetPassword } from '@/src/components/pages/auth/reset-password'

type ResetPasswordSearch = {
  token?: string
  error?: string
}

export const Route = createFileRoute('/auth/reset-password')({
  component: ResetPassword,
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => ({
    token: typeof search.token === 'string' ? search.token : undefined,
    error: typeof search.error === 'string' ? search.error : undefined,
  }),
})
