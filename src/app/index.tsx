import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '@/src/components/pages/home'

export const Route = createFileRoute('/')({
  component: HomePage,
})
