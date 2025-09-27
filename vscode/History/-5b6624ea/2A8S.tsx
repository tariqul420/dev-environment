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
import Logo from '../logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

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
                    <SidebarMenuButton className={`dark:hover:bg-dark-lite hover:bg-gray-100 ${isActive(item?.url) ? 'dark:bg-dark-lite bg-gray-100' : ''}`} asChild>
                      <Link
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            toggleSidebar();
                          }
                        }}
                        href={item?.url || '#'}
                        className="">
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
      <SidebarFooter className="flex items-center justify-between px-4 py-3 border-t bg-muted/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={user?.image || '/default-avatar.png'} alt={user?.name || 'User'} />
            <AvatarFallback className="text-sm">{user?.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-foreground">{user?.name || 'Admin'}</span>
            <span className="truncate text-xs text-muted-foreground">{user?.email || 'admin@example.com'}</span>
          </div>
        </div>

        <SidebarMenuButton size="icon" className="rounded-full hover:bg-muted transition">
          <MoreVerticalIcon className="h-4 w-4" />
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
