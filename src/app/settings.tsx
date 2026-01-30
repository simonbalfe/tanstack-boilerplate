import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '@/src/components/pages/settings'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})
