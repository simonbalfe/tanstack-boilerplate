import { useUser } from '@shared/hooks/use-user'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Spinner } from '@ui/components/spinner'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const navigate = useNavigate()
  const { user, loading } = useUser()

  useEffect(() => {
    if (!loading) {
      if (user) {
        void navigate({ to: '/dashboard' })
      } else {
        void navigate({ to: '/auth' })
      }
    }
  }, [user, loading, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner className="h-8 w-8 text-primary" />
    </div>
  )
}
