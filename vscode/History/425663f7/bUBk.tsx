import { auth } from "@clerk/nextjs/server";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

import DashboardHeader from "@/components/dashboard/dashboard-header";
import { sidebar } from "@/constant/dashboard";
import { ChildrenProps } from "@/types";

export const metadata = {
  title: "Dashboard | Next.ts",
  description: "Welcome Next.ts Dashboard.",
};

type Role = keyof typeof sidebar;

export default async function Layout({ children }: ChildrenProps) {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.role as Role | undefined;

  return (
    <SidebarProvider>
      <div className="font-grotesk flex min-h-screen w-full">
        {/* Sidebar */}
        {role && <DashboardSidebar menu={sidebar[role]} />}

        {/* Main area */}
        <div className="flex flex-1 flex-col">
          {/* Header/Navbar */}
          {/* <header className="dark:bg-dark-lite w-full bg-[#FAFAFA] shadow-sm">
            <nav className="flex items-center justify-between gap-4 px-4 py-3">
              <SidebarTrigger className="cursor-pointer" />
              <div className="flex items-center gap-4">
                <ModeToggle />
              </div>
            </nav>
          </header> */}
          <DashboardHeader role={role as Role} />

          {/* Main content */}
          <main className="flex-1">
            <div className="@container/main min-h-screen w-full px-4 py-4 lg:px-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
