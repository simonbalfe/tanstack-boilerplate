'use client'

import { AppSidebar } from '@shared/components/layout/app-sidebar'
import { useUser } from '@shared/hooks/use-user'
import { useLocation } from '@tanstack/react-router'
import { Separator } from '@ui/components/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@ui/components/sidebar'
import { Toaster } from '@ui/components/sonner'
import { Spinner } from '@ui/components/spinner'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/settings': 'Settings',
}

export const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const { user, loading } = useUser()

  if (location.pathname.startsWith('/auth')) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  if (!user) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden flex flex-col">
        <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b bg-card px-4">
          <SidebarTrigger className="-ml-1 size-7 text-muted-foreground hover:text-foreground" />
          <Separator orientation="vertical" className="mr-1 h-4" />
          <span className="text-sm font-semibold text-foreground">
            {PAGE_TITLES[location.pathname] ?? ''}
          </span>
        </header>
        <main className="flex-1 overflow-hidden flex flex-col">{children}</main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
