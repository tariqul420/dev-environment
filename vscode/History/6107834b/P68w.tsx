import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { requireAdmin } from '@/lib/auth/require-admin';
import { ChildrenProps } from '@/types';

type Role = keyof typeof sidebar;

export default async function layout({ children }: ChildrenProps) {
  const session = await requireAdmin();

  const user = session?.user;
  const role = session.user.role as Role | undefined;

  return (
    <SidebarProvider>
      {role && <DashboardSidebar menu={sidebar[role]} user={user} />}

      <header className="sticky top-0 z-40 dark:bg-dark-lite bg-[#FAFAFA] shadow-sm">
        <nav className="flex w-full items-center justify-between gap-4 px-4 py-3">
          <SidebarTrigger className="cursor-pointer" />
          <div className="flex items-center gap-4">
            <ModeToggle />
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <div className="@container/main min-h-screen w-full px-4 py-4 lg:px-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
