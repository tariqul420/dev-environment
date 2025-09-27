'use client';

import { Sidebar, SidebarContent, SidebarHeader, SidebarRail, useSidebar } from '@/components/ui/sidebar';
import { ToolsData } from '@/data/tools';
import * as React from 'react';
import { NavMain } from './nav-main';

export function ToolsSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, setOpen } = useSidebar(); // assumes shadcn sidebar hook exposes setOpen(boolean)

  // prevent flicker when moving across children
  const hoverTimer = React.useRef<NodeJS.Timeout | null>(null);

  const handleEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (state === 'collapsed') setOpen(true);
  };

  const handleLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    // small delay feels nicer and avoids accidental closes
    hoverTimer.current = setTimeout(() => {
      if (state === 'expanded') setOpen(false);
    }, 120);
  };

  return (
    <Sidebar collapsible="icon" onMouseEnter={handleEnter} onMouseLeave={handleLeave} {...props}>
      {/* Header */}
      <SidebarHeader className="px-3 py-4 border-b">
        {state === 'collapsed' ? (
          <div className="flex items-center justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">TH</div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">TH</div>
            <h2 className="text-base font-semibold tracking-tight">Tools Hub</h2>
          </div>
        )}
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <NavMain items={ToolsData} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
