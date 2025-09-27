'use client';

import { FolderKanban, LayoutDashboard, MoreVerticalIcon, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
import { signOut } from 'next-auth/react';
import Logo from '../logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

// Map of icon names to their corresponding components
const iconMap = {
  LayoutDashboard,
  FolderKanban,
  Newspaper,
} as const;

export type IconMapKey = keyof typeof iconMap;

export interface DashboardSidebarProps {
  menu: {
    title: string;
    url: string;
    icon: IconMapKey;
  }[];
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export function DashboardSidebar({ menu = [], user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  // Function to determine if a menu item is active
  const isActive = (url: string) => {
    if (!url) return false;
    // Exact match for dashboard routes
    if (['/admin'].includes(url)) {
      return pathname === url;
    }
    // Partial match for other routes
    return pathname.startsWith(url);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => {
                const IconComponent = iconMap[item?.icon];

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton className={cn('hover:bg-accent hover:text-accent-foreground', isActive(item?.url) && 'bg-accent text-accent-foreground')} asChild>
                      <Link
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            toggleSidebar();
                          }
                        }}
                        href={item?.url || '#'}>
                        {IconComponent ? <IconComponent /> : null}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex items-center justify-between p-4 border-t bg-muted/50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="w-full flex items-center justify-between gap-3 px-2 py-1.5 rounded-md hover:bg-muted">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.image || '/default-avatar.png'} alt={user?.name || 'User'} />
                  <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-sm leading-tight text-left">
                  <div className="font-medium">{user?.name || 'Admin'}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[140px]">{user?.email}</div>
                </div>
              </div>

              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="top" align="end" className="w-52">
            <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
