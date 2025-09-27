import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ChildrenProps } from '@/types';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function layout({ children }: ChildrenProps) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return redirect('/login');
  }

  const role = session.user.role as string;

  return (
    <SidebarProvider>
      {role && <DashboardSidebar menu={sidebar[role]} />}
      <main className="flex-1">
        <nav className="dark:bg-dark-lite sticky top-0 z-[20] flex w-full items-center justify-between gap-4 bg-[#FAFAFA] px-4 py-3 shadow-sm">
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
