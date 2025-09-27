export const dynamic = "force-dynamic";

import { AdminCharts } from "@/components/dashboard/admin/admin-charts";
import { AdminStats } from "@/components/dashboard/admin/admin-stats";
import {
  getBlogsStats,
  getOrdersStats,
  getProductsStats,
  getRevenueStats,
  getSellingReport,
} from "@/lib/actions/stats.action";

export default async function Dashboard() {
  const [sellingReport, revenueStats, productsStats, ordersStats, blogsStats] =
    await Promise.all([
      getSellingReport(),
      getRevenueStats(),
      getProductsStats(),
      getOrdersStats(),
      getBlogsStats(),
    ]);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <AdminStats
        revenueStats={revenueStats}
        productsStats={productsStats}
        ordersStats={ordersStats}
        blogsStats={blogsStats}
      />
      <AdminCharts
        sellingReport={sellingReport}
        revenueStats={revenueStats}
        productsStats={productsStats}
        ordersStats={ordersStats}
        blogsStats={blogsStats}
      />
    </div>
  );
}
