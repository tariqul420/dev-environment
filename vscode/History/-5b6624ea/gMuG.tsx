'use client';

import { ChevronRight, FolderKanban, LayoutDashboard, MoreVertical, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import Logo from '../logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const iconMap = {
  LayoutDashboard,
  FolderKanban,
  Newspaper,
} as const;
export type IconMapKey = keyof typeof iconMap;

export interface DashboardSidebarProps {
  menu: { title: string; url: string; icon: IconMapKey }[];
  user: { id?: string; name?: string | null; email?: string | null; image?: string | null; role?: string };
}

export function DashboardSidebar({ menu = [], user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  const isActive = (url: string) => (url === '/admin' ? pathname === url : pathname.startsWith(url));

  // First letter for avatar fallback
  const fallback = useMemo(() => (user?.name?.[0] || 'U').toUpperCase(), [user?.name]);

  function notAvailableURL(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    toast.warning('URL not available!');
  }

  return (
    <TooltipProvider>
      <Sidebar className="bg-gradient-to-b from-background to-muted/30 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <SidebarHeader className="px-3 py-2">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <Logo />
            </Link>
            {/* Collapser for small screens */}
            <button onClick={toggleSidebar} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground lg:hidden" aria-label="Toggle sidebar">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </SidebarHeader>

        <Separator />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium tracking-wide text-muted-foreground">Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menu.map((item) => {
                  const Icon = iconMap[item.icon] ?? LayoutDashboard;
                  const active = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip delayDuration={200}>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            className={cn(
                              'relative group overflow-hidden rounded-xl transition-colors',
                              active ? 'bg-accent text-accent-foreground shadow-[inset_0_0_0_1px_theme(colors.border)]' : 'hover:bg-muted/60 hover:text-foreground',
                            )}>
                            <Link
                              href={item.url || '#'}
                              aria-current={active ? 'page' : undefined}
                              onClick={() => {
                                if (typeof window !== 'undefined' && window.innerWidth < 768) toggleSidebar();
                              }}
                              className="flex items-center gap-3 px-2.5 py-2">
                              {/* Active accent bar */}
                              <span
                                className={cn('absolute left-0 top-0 h-full w-1 bg-primary/70 transition-transform', active ? 'translate-x-0' : '-translate-x-full group-hover:translate-x-0')}
                                aria-hidden
                              />
                              <span className={cn('grid place-items-center rounded-md border bg-background p-1.5 text-foreground/80', active && 'border-primary/30')}>
                                <Icon className="h-4 w-4" />
                              </span>
                              <span className="truncate text-sm font-medium">{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">{item.title}</TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <Separator className="mt-auto" />

        <SidebarFooter className="border-t bg-muted/40 p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-muted">
                <span className="flex items-center gap-3">
                  <span className="relative">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.image || '/default-avatar.png'} alt={user?.name || 'User'} />
                      <AvatarFallback>{fallback}</AvatarFallback>
                    </Avatar>
                    <span className="absolute -right-0.5 -top-0.5 block h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" aria-label="Online" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{user?.name || 'Admin'}</span>
                    <span className="block truncate text-xs text-muted-foreground">{user?.email}</span>
                  </span>
                </span>
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end" className="w-56">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/admin/profile" onClick={notAvailableURL}>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}

export default DashboardSidebar;
