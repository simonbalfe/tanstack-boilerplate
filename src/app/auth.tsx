import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '@/src/components/pages/auth'

export const Route = createFileRoute('/auth')({
  component: AuthPage,
})
