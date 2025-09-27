export const dynamic = "force-dynamic";

import { AdminCharts } from "@/components/dashboard/admin/admin-charts";
import { AdminStats } from "@/components/dashboard/admin/admin-stats";
import OrderMonthlyRevenue from "@/components/dashboard/admin/orders/order-monthly-revenue";
import OrderReferralTraffic from "@/components/dashboard/admin/orders/order-referral-traffic";
import AbandonedCartsCard from "@/components/dashboard/admin/widgets/abandoned-carts-card";
import LowStockCard from "@/components/dashboard/admin/widgets/low-stock-card";
import PaymentMixCard from "@/components/dashboard/admin/widgets/payment-mix-card";
import TrendingProductsCard from "@/components/dashboard/admin/widgets/trending-products-card";
// NEW: imports
import {
  getAbandonedCarts,
  getLowStockProducts,
  getPaymentMix,
  getTrendingProducts,
} from "@/lib/actions/dashboard.extra.action";
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

    // NEW: data loads
    lowStock,
    trending,
    payMix,
    abandoned,
  ] = await Promise.all([
    getSellingReport(),
    getRevenueStats(),
    getProductsStats(),
    getOrdersStats(),
    getBlogsStats(),
    getReferralDistribution(),
    getMonthlyRevenueLastYear(),

    // NEW:
    getLowStockProducts({ threshold: 5, limit: 10 }),
    getTrendingProducts({ rangeDays: 30, limit: 9 }),
    getPaymentMix({ rangeDays: 30 }),
    getAbandonedCarts({ inactiveHours: 12, rangeDays: 7, limit: 10 }),
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

      {/* NEW row: quick wins */}
      <section className="grid gap-4 lg:grid-cols-3">
        <LowStockCard items={lowStock} />
        <PaymentMixCard data={payMix} />
        <AbandonedCartsCard summary={abandoned.summary} rows={abandoned.rows} />
      </section>

      {/* NEW row: trending */}
      <section>
        <TrendingProductsCard items={trending} />
      </section>
    </main>
  );
}
