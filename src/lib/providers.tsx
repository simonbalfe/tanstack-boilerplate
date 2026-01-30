import { useEffect, Suspense } from 'react'
import { useLocation } from '@tanstack/react-router'
import { usePostHog } from 'posthog-js/react'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import env from '@/src/env'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false,
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  )
}

function PostHogPageView() {
  const location = useLocation()
  const posthog = usePostHog()

  useEffect(() => {
    let url = window.origin + location.pathname
    if (location.searchStr) {
      url = url + location.searchStr
    }
    posthog.capture('$pageview', { $current_url: url })
  }, [location.pathname, location.searchStr, posthog])

  return null
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}
