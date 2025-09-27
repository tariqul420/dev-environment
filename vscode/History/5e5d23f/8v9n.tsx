export const dynamic = "force-dynamic";

import OrderMonthlyRevenue from "@/components/dashboard/admin/orders/order-monthly-revenue";
import OrderReferralTraffic from "@/components/dashboard/admin/orders/order-referral-traffic";
import { AdminCharts } from "@/components/dashboard/admin/widgets/admin-charts";
import { AdminStats } from "@/components/dashboard/admin/widgets/admin-stats";
import {
  getBlogsStats,
  getMonthlyRevenueLastYear,
  getOrdersStats,
  getProductsStats,
  getReferralDistribution,
  getRevenueStats,
  getSellingReport,
} from "@/lib/actions/admin.action";

export default async function Dashboard() {
  const [
    sellingReport,
    revenueStats,
    productsStats,
    ordersStats,
    blogsStats,
    referralData,
    revenueData,
  ] = await Promise.all([
    getSellingReport(),
    getRevenueStats(),
    getProductsStats(),
    getOrdersStats(),
    getBlogsStats(),
    getReferralDistribution(),
    getMonthlyRevenueLastYear(),
  ]);

  return (
    <main className="space-y-4 md:space-y-6">
      <AdminStats
        revenueStats={revenueStats}
        productsStats={productsStats}
        ordersStats={ordersStats}
        blogsStats={blogsStats}
      />
      <AdminCharts sellingReport={sellingReport} />
      <div className="grid gap-4 md:grid-cols-2">
        <OrderReferralTraffic referralData={referralData} />
        <OrderMonthlyRevenue revenueData={revenueData} />
      </div>
    </main>
  );
}
