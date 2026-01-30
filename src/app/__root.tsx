import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { PostHogProvider } from '@/src/lib/providers'
import { LayoutContent } from '@/src/components/templates/layout-content'
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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning className="font-primary">
        <PostHogProvider>
          <LayoutContent>
            <Outlet />
          </LayoutContent>
        </PostHogProvider>
        <Scripts />
      </body>
    </html>
  )
}
