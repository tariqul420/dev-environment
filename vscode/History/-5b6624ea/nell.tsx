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
  title: string;
  url: string;
  icon: IconMapKey;
}

export function DashboardSidebar({ menu = [], user }: { menu: DashboardSidebarProps[] }) {
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
      <SidebarFooter className="flex items-center justify-between p-4 border-t bg-muted/50">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.image || '/default-avatar.png'} alt={user?.name || 'User'} />
            <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="text-sm leading-tight">
            <div className="font-medium">{user?.name || 'Admin'}</div>
            <div className="text-xs text-muted-foreground">{user?.email}</div>
          </div>
        </div>

        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <MoreVerticalIcon className="ml-auto size-4" />
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
