import { useUser } from '@shared/hooks/use-user'
import { authClient } from '@shared/lib/auth-client'
import { useCheckout } from '@shared/lib/checkout-api'
import { Link, useLocation } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@ui/components/avatar'
import { Badge } from '@ui/components/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/components/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@ui/components/sidebar'
import {
  ChevronUp,
  Crown,
  FlaskConical,
  Home,
  LogOut,
  Settings,
  User as UserIcon,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const navItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Demo', url: '/demo', icon: FlaskConical },
  { title: 'Settings', url: '/settings', icon: Settings },
]

export function AppSidebar() {
  const location = useLocation()
  const pathname = location.pathname
  const { user } = useUser()
  const { handleCheckout, isLoading } = useCheckout(user?.id)
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null)
  const [tier, setTier] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      void fetch('/api/subscription/check')
        .then((res) => res.json())
        .then((data) => {
          setIsSubscribed(data.isSubscribed)
          setTier(data.tier)
        })
    }
  }, [user])

  const handleSignOut = async () => {
    await authClient.signOut()
    window.location.href = '/auth'
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <img src="/logo.svg" alt="LaunchStack" className="size-6 shrink-0" />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">LaunchStack</span>
                  {tier && <span className="text-xs text-muted-foreground">{tier} Plan</span>}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isSubscribed && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleCheckout}
                    disabled={isLoading}
                    tooltip="Upgrade to Pro"
                    className="border border-primary/20 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                  >
                    <Zap className="size-4 fill-primary" />
                    <span>{isLoading ? 'Loading...' : 'Upgrade to Pro'}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'User'} />
                    <AvatarFallback className="rounded-lg">
                      <UserIcon className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name ?? 'User'}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {isSubscribed && <Crown className="size-4 text-primary" />}
                    <ChevronUp className="size-4" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                {tier && (
                  <DropdownMenuItem disabled>
                    <Badge variant={tier === 'Pro' ? 'default' : 'secondary'} className="mr-2">
                      {tier}
                    </Badge>
                    Current Plan
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
