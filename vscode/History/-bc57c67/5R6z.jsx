import DashboardHeader from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { sidebar } from "@/constant/dashboard";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata = {
  title: "Dashboard | Jishanul Haque",
  description: "Welcome Jishanul Haque Dashboard.",
};

export default async function layout({ children }) {
  const session = await requireAdmin();
  const user = session?.user;
  const role = session.user.role;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        {role && <DashboardSidebar menu={sidebar[role]} user={user} />}

        {/* Main area */}
        <div className="flex flex-1 flex-col">
          {/* Header/Navbar */}
          <DashboardHeader />

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
