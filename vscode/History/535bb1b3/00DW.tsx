'use client';

import { Sidebar, SidebarContent, SidebarHeader, SidebarRail, useSidebar } from '@/components/ui/sidebar';
import { ToolsData } from '@/data/tools';
import * as React from 'react';
import { NavMain } from './nav-main';

export function ToolsSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className={[
        // Glass container
        'border-r',
        'border-white/10',
        'bg-[rgb(10_10_12/0.35)]',
        'backdrop-blur-xl',
        // Better fallback when backdrop-filter isn’t supported
        'supports-[backdrop-filter]:bg-[rgb(10_10_12/0.55)]',
        // Subtle inner highlight for depth
        'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_8px_24px_-8px_rgba(0,0,0,0.6)]',
        className ?? '',
      ].join(' ')}
      {...props}>
      {/* Header */}
      <SidebarHeader className="px-3 py-4 border-b border-white/10">
        {state === 'collapsed' ? (
          <div className="flex items-center justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white font-bold shadow-[0_2px_10px_rgba(0,0,0,0.35)]">TH</div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white font-bold shadow-[0_2px_10px_rgba(0,0,0,0.35)]">TH</div>
            <h2 className="text-base font-semibold tracking-tight text-white/90">Tools Hub</h2>
          </div>
        )}
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="pt-2">
        <NavMain items={ToolsData} />
      </SidebarContent>

      {/* Optional footer (kept simple so it won’t error if your UI kit has no SidebarFooter) */}
      <div className="mt-auto p-3 border-t border-white/10 text-xs text-white/50">
        <div className="flex items-center justify-between">
          <span className="truncate">v1.0</span>
          <span className="opacity-70">© Tools Hub</span>
        </div>
      </div>

      <SidebarRail />
    </Sidebar>
  );
}
