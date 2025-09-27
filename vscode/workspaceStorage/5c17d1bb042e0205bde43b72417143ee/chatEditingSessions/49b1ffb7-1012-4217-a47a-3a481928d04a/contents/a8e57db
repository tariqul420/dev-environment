export const dynamic = "force-dynamic";

import { ShoppingCart, TrendingUp } from "lucide-react";
import CustomerProfileCard from "@/components/dashboard/customer/customer-profile-card";
import CustomerStats from "@/components/dashboard/customer/customer-stats";
import QuickActionsPanel from "@/components/dashboard/customer/quick-actions-panel";
import SpendingSummary from "@/components/dashboard/customer/spending-summary";
import RecommendedProducts from "@/components/dashboard/customer/recommended-products";
import DataTable from "@/components/dashboard/data-table";
import { customerOrdersColumns } from "@/components/dashboard/table-columns";
import { 
  getCustomerOrdersReport, 
  getCustomerProfile, 
  getCustomerSpendingSummary,
  getRecommendedProducts 
} from "@/lib/actions/customer.action";
import { getOrdersForCustomer } from "@/lib/actions/order.action";

export default async function Dashboard({ searchParams }: DashboardPros) {
  const { pageSize, pageIndex, search } = await searchParams;

  const [{ orders, pagination }, ordersStats] = await Promise.all([
    getOrdersForCustomer({
      limit: Number(pageSize || 20),
      page: Number(pageIndex || 1),
      search: search?.trim(),
    }),
    getCustomerOrdersReport(),
  ]);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <CustomerStats ordersStats={ordersStats} />

      {/* Orders Section */}
      <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
        <ShoppingCart /> Orders
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
  );
}
