import DashboardHeader from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { sidebar } from "@/constant/dashboard";
import { requireAdmin } from "@/lib/auth/require-admin";
import { Clock } from "lucide-react";

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
          <header className="bg-card w-full shadow-sm">
            <nav className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="cursor-pointer" />

                {/* Current Time */}
                <div className="bg-muted text-muted-foreground inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm">
                  <Clock size={14} className="text-primary" />
                  <span>
                    {currentTime.toLocaleString("en-US", {
                      timeZone: "Asia/Dhaka",
                      hour12: true,
                    })}
                  </span>
                </div>

                {/* System Status */}
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                    isOnline
                      ? "bg-green-900/80 text-green-300"
                      : "bg-red-900/80 text-red-300"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isOnline ? "animate-pulse bg-green-400" : "bg-red-400"
                    }`}
                  />
                  <span>System {isOnline ? "Online" : "Offline"}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* <ModeToggle /> */}
              </div>
            </nav>
          </header>

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
