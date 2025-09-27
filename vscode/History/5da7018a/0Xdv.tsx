// app/(tools)/layout.tsx  (or wherever this layout lives)
'use client';

import { AppSidebar } from '@/components/ui/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { ChildrenProps } from '@/types';
import { motion } from 'framer-motion';

// Background FX extracted so layout stays readable
function BackgroundFX() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {/* soft radial glow */}
      <div
        className="absolute left-1/2 top-[-10%] h-[55rem] w-[55rem] -translate-x-1/2 rounded-full 
                      bg-gradient-to-b from-primary/30 via-primary/10 to-transparent blur-3xl"
      />
      {/* grid dots */}
      <div
        className="absolute inset-0 opacity-40 
                      bg-[radial-gradient(circle_at_center,theme(colors.muted.DEFAULT)/10_1px,transparent_1px)]
                      [background-size:24px_24px]"
      />
      {/* diagonal sheen */}
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,theme(colors.background/30)_30%,transparent_60%)]" />
    </div>
  );
}

export default function Layout({ children }: ChildrenProps) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full overflow-hidden">
        <BackgroundFX />

        {/* Sidebar */}
        <AppSidebar />

        {/* Main area */}
        <div className="flex flex-1 flex-col">
          {/* Optional global top bar goes here */}

          <main className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="@container/main min-h-screen w-full px-4 py-4 lg:px-6">
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
