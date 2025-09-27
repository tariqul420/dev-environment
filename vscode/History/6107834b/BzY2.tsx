import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { sidebar } from '@/constant/dashboard';
import { requireAdmin } from '@/lib/auth/require-admin';
import { ChildrenProps } from '@/types';

export const metadata = {
  title: 'Dashboard | Tariqul Islam',
  description: 'Welcome Tariqul Islam Dashboard.',
};

type Role = keyof typeof sidebar;

export default async function layout({ children }: ChildrenProps) {
  const session = await requireAdmin();

  const user = session?.user;
  const role = session.user.role as Role | undefined;

  return (
    <SidebarProvider>
      {role && <DashboardSidebar menu={sidebar[role]} user={user} />}
      <main className="flex-1">
        <nav className="dark:bg-dark-lite flex w-full items-center justify-between gap-4 bg-[#FAFAFA] px-4 py-3 shadow-sm">
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
