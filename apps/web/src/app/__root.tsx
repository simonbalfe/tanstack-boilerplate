import { LayoutContent } from '@shared/components/layout/layout-content'
import { PostHogProvider } from '@shared/components/providers/posthog-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { useState } from 'react'
import '@/src/globals.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: 'SaaS Boilerplate' },
      { name: 'description', content: 'A modern SaaS boilerplate with auth and payments' },
    ],
  }),
  component: RootLayout,
})

function RootLayout() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning className="font-primary">
        <QueryClientProvider client={queryClient}>
          <PostHogProvider>
            <LayoutContent>
              <Outlet />
            </LayoutContent>
          </PostHogProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
