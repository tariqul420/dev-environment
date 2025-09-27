'use client';

import { FolderKanban, LayoutDashboard, MoreVerticalIcon } from 'lucide-react';
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

// Map of icon names to their corresponding components
const iconMap = {
  LayoutDashboard,
  FolderKanban,
} as const;

export type IconMapKey = keyof typeof iconMap;

export interface DashboardSidebarProps {
  title: string;
  url: string;
  icon: IconMapKey;
}

export function DashboardSidebar({ menu = [] }: { menu: DashboardSidebarProps[] }) {
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
      <SidebarFooter>
        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <MoreVerticalIcon className="ml-auto size-4" />
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
