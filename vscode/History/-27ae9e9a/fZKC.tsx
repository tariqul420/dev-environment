export const dynamic = "force-dynamic";

import { ShoppingCart } from "lucide-react";
import CustomerProfileCard from "@/components/dashboard/customer/customer-profile-card";
import CustomerStats from "@/components/dashboard/customer/customer-stats";
import QuickActionsPanel from "@/components/dashboard/customer/quick-actions-panel";
import RecommendedProducts from "@/components/dashboard/customer/recommended-products";
import SpendingSummary from "@/components/dashboard/customer/spending-summary";
import DataTable from "@/components/dashboard/data-table";
import { customerOrdersColumns } from "@/components/dashboard/table-columns";
import {
  getCustomerOrdersReport,
  getCustomerSpendingSummary,
  getRecommendedProducts,
} from "@/lib/actions/customer.action";
import { getOrdersForCustomer } from "@/lib/actions/order.action";

export default async function Dashboard({ searchParams }: DashboardPros) {
  const { pageSize, pageIndex, search } = await searchParams;

  const [{ orders, pagination }, ordersStats, spendingData, recommendedProducts] =
    await Promise.all([
      getOrdersForCustomer({
        limit: Number(pageSize || 20),
        page: Number(pageIndex || 1),
        search: search?.trim(),
      }),
      getCustomerOrdersReport(),
      getCustomerSpendingSummary(),
      getRecommendedProducts(),
    ]);

  return (
    <div className="flex flex-col gap-6">
      <QuickActionsPanel />

      {/* Stats Section */}
      <CustomerStats ordersStats={ordersStats} />

      {/* Spending Summary */}
      <SpendingSummary spendingData={spendingData} />

      {/* Recommended Products */}
      <RecommendedProducts products={recommendedProducts} />

      {/* Orders Section */}
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
          <ShoppingCart /> Recent Orders
        </h2>

        <DataTable
          pageIndex={Number(pageIndex || "1")}
          pageSize={Number(pageSize || "20")}
          total={pagination?.totalItems || 0}
          data={orders || []}
          columns={customerOrdersColumns || []}
          uniqueIdProperty="_id"
          enableRowSelection={false}
        />
      </div>
    </div>
  );
}
