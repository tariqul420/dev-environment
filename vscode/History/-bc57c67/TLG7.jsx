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
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        {role && <DashboardSidebar menu={sidebar[role]} user={user} />}

        {/* Main area */}
        <div className="flex flex-col flex-1">
          {/* Header/Navbar */}
          <header className="w-full dark:bg-dark-lite bg-[#FAFAFA] shadow-sm">
            <nav className="flex items-center justify-between gap-4 px-4 py-3">
              <SidebarTrigger className="cursor-pointer" />
              <div className="flex items-center gap-4">
                <ModeToggle />
              </div>
            </nav>
          </header>

          {/* Main content */}
          <main className="flex-1">
            <div className="@container/main min-h-screen w-full px-4 py-4 lg:px-6">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}