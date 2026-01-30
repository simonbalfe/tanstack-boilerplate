import { createFileRoute } from '@tanstack/react-router'
import { DemoPage } from '@/src/components/pages/demo'

export const Route = createFileRoute('/demo')({
  component: DemoPage,
})
