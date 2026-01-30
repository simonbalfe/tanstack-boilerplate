'use client'

import { useUser } from '@/src/hooks/use-user'
import { AppSidebar } from '@/src/components/layout/app-sidebar'
import { Toaster } from '@/src/components/ui/sonner'
import { useLocation } from '@tanstack/react-router'
import { Spinner } from '@/src/components/ui/spinner'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/src/components/ui/sidebar'
import { Separator } from '@/src/components/ui/separator'

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
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium text-muted-foreground">
            {location.pathname === '/dashboard' && 'Dashboard'}
            {location.pathname === '/settings' && 'Settings'}
          </span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
