export const dynamic = "force-dynamic";

import { ShoppingCart, TrendingUp } from "lucide-react";
import CustomerProfileCard from "@/components/dashboard/customer/customer-profile-card";
import CustomerStats from "@/components/dashboard/customer/customer-stats";
import QuickActionsPanel from "@/components/dashboard/customer/quick-actions-panel";
import RecommendedProducts from "@/components/dashboard/customer/recommended-products";
import SpendingSummary from "@/components/dashboard/customer/spending-summary";
import DataTable from "@/components/dashboard/data-table";
import { customerOrdersColumns } from "@/components/dashboard/table-columns";
import {
  getCustomerOrdersReport,
  getCustomerProfile,
  getCustomerSpendingSummary,
  getRecommendedProducts,
} from "@/lib/actions/customer.action";
import { getOrdersForCustomer } from "@/lib/actions/order.action";

export default async function Dashboard({ searchParams }: DashboardPros) {
  const { pageSize, pageIndex, search } = await searchParams;

  const [
    { orders, pagination },
    ordersStats,
    customerProfile,
    spendingSummary,
    recommendedProducts,
  ] = await Promise.all([
    getOrdersForCustomer({
      limit: Number(pageSize || 20),
      page: Number(pageIndex || 1),
      search: search?.trim(),
    }),
    getCustomerOrdersReport(),
    getCustomerProfile(),
    getCustomerSpendingSummary(),
    getRecommendedProducts(6),
  ]);

  return (
    <div className="space-y-6">
      {/* Top Section - Profile & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CustomerProfileCard profile={customerProfile} />
        </div>
        <div>
          <QuickActionsPanel />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <CustomerStats ordersStats={ordersStats} />
        </div>
        <div>
          <SpendingSummary
            totalSpent={spendingSummary.totalSpent}
            monthlySpent={spendingSummary.monthlySpent}
            averageOrderValue={spendingSummary.averageOrderValue}
          />
        </div>
      </div>

      {/* Recommended Products */}
      <RecommendedProducts products={recommendedProducts} />

      {/* Orders Section */}
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
          <ShoppingCart /> আমার অর্ডার সমূহ
        </h2>

        <DataTable
          pageIndex={Number(pageIndex || "1")}
          pageSize={Number(pageSize || "20")}
          total={pagination?.totalItems || 0}
          data={orders || []}
          columns={customerOrdersColumns || []}
          uniqueIdProperty="id"
          enableRowSelection={false}
        />
      </div>
    </div>
  );
}
