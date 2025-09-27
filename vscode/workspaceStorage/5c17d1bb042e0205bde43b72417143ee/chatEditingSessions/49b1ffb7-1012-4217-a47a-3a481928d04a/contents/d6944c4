export const dynamic = "force-dynamic";

import { Package, BarChart3, Users } from "lucide-react";
import StaffStats from "@/components/dashboard/staff/staff-stats";
import StaffQuickActions from "@/components/dashboard/staff/staff-quick-actions";
import StaffRecentOrders from "@/components/dashboard/staff/staff-recent-orders";
import StaffPerformance from "@/components/dashboard/staff/staff-performance";
import { 
  getStaffStats, 
  getStaffRecentOrders, 
  getStaffPerformance 
} from "@/lib/actions/staff.action";

export default async function StaffDashboard() {
  const [
    statsData,
    recentOrders,
    performanceData,
  ] = await Promise.all([
    getStaffStats(),
    getStaffRecentOrders(8),
    getStaffPerformance(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Staff Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage orders, track performance, and support customers
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <StaffQuickActions />

      {/* Stats Overview */}
      <div className="space-y-2">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
          <BarChart3 className="h-5 w-5" />
          Overview
        </h2>
        <StaffStats statsData={statsData} />
      </div>

      {/* Performance & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
            <Users className="h-5 w-5" />
            Performance
          </h2>
          <StaffPerformance performanceData={performanceData} />
        </div>

        {/* Recent Orders */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
            <Package className="h-5 w-5" />
            Recent Orders
          </h2>
          <StaffRecentOrders orders={recentOrders} />
        </div>
      </div>
    </div>
  );
}
