'use client'

import { AppSidebar } from '@shared/components/layout/app-sidebar'
import { useUser } from '@shared/hooks/use-user'
import { useLocation } from '@tanstack/react-router'
import { Separator } from '@ui/components/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@ui/components/sidebar'
import { Toaster } from '@ui/components/sonner'
import { Spinner } from '@ui/components/spinner'

export const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const { user, loading } = useUser()

  if (location.pathname.startsWith('/auth')) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <Spinner className="h-12 w-12 text-primary" />
      </div>
    )
  }

  if (!user) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium text-muted-foreground">
            {location.pathname === '/dashboard' && 'Dashboard'}
            {location.pathname === '/demo' && 'Demo'}
            {location.pathname === '/settings' && 'Settings'}
          </span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
