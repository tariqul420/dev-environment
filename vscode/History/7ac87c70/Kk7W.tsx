'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  const isActiveItems = (url: string) => (url === '/admin' ? pathname === url : pathname.startsWith(url));

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-white/60">Platform</SidebarGroupLabel>
      <SidebarMenu className="px-2">
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
            <SidebarMenuItem
              className={[
                // Row glass: translucent hover + border top hairline
                'rounded-xl',
                'border border-transparent',
                'hover:border-white/10',
                'transition-colors',
                'duration-200',
              ].join(' ')}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={[
                    // Glass button surface
                    'rounded-xl',
                    'bg-white/5',
                    'hover:bg-white/10',
                    'active:bg-white/15',
                    'text-white/85',
                    'shadow-[0_1px_0_0_rgba(255,255,255,0.04),inset_0_-1px_0_0_rgba(255,255,255,0.02)]',
                    'transition-colors',
                    'duration-200',
                  ].join(' ')}>
                  {item.icon && <item.icon className="opacity-90" />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto opacity-80 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub className="mt-1 ml-2 border-l border-white/10">
                  {item.items?.map((subItem) => {
                    const active = isActiveItems(subItem.url);
                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={active}
                          className={[
                            'rounded-lg',
                            'pl-3',
                            'my-[2px]',
                            // Subtle glass chip for active state
                            active
                              ? 'bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_6px_18px_-6px_rgba(0,0,0,0.5)]'
                              : 'bg-transparent text-white/75 hover:bg-white/5 hover:text-white',
                          ].join(' ')}>
                          <Link href={subItem.url} aria-current={active ? 'page' : undefined}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
