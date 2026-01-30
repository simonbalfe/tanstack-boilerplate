import { createFileRoute } from '@tanstack/react-router'
import { TestPage } from '@/src/components/pages/test'

export const Route = createFileRoute('/test')({
  head: () => ({
    meta: [
      { title: 'Design System Test' },
      { name: 'description', content: 'Testing typography and design tokens' },
    ],
  }),
  component: TestPage,
})
