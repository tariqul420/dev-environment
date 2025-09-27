export const dynamic = "force-dynamic";

import { AdminCharts } from "@/components/dashboard/admin/admin-charts";
import { AdminStats } from "@/components/dashboard/admin/admin-stats";
import OrderMonthlyRevenue from "@/components/dashboard/admin/order/order-monthly-revenue";
import OrderReferralTraffic from "@/components/dashboard/admin/order/order-referral-traffic";
import {
  getBlogsStats,
  getMonthlyRevenueLastYear,
  getOrdersStats,
  getProductsStats,
  getReferralDistribution,
  getRevenueStats,
  getSellingReport,
} from "@/lib/actions/stats.action";

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
    <section className="flex flex-col gap-4 md:gap-6">
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
    </section>
  );
}
