import { ModeToggle } from '@/components/global/mode-toggle';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ChildrenProps } from '@/types';

export default function DashboardLayout({ children }: ChildrenProps) {
  return (
    <SidebarProvider>
      <main className="flex-1">
        <nav className="dark:bg-dark-lite sticky top-0 z-[20] flex w-full items-center justify-between gap-4 bg-light px-4 py-3 shadow-sm">
          <SidebarTrigger className="cursor-pointer" />
          <div className="flex items-center gap-4">
            <ModeToggle />
          </div>
        </nav>
        <div className="@container/main w-full px-4 py-4 lg:px-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
