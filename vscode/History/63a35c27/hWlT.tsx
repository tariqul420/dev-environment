export const dynamic = "force-dynamic";

import CustomerStats from "@/components/dashboard/customer/customer-stats";
import DataTable from "@/components/dashboard/data-table";
import { customerOrdersColumns } from "@/components/dashboard/table-columns";
import { getOrdersForCustomer } from "@/lib/actions/order.action";
import { getCustomerOrderReport } from "@/lib/actions/stats.action";
import { DashboardSearchParamsPros } from "@/types";
import { ShoppingCart } from "lucide-react";

export default async function Dashboard({
  searchParams,
}: DashboardSearchParamsPros) {
  const { pageSize, pageIndex, search } = await searchParams;

  const [{ orders, pagination }, ordersStats] = await Promise.all([
    getOrdersForCustomer({
      limit: Number(pageSize || 20),
      page: Number(pageIndex || 1),
      search: search?.trim(),
    }),
    getCustomerOrderReport(),
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
        uniqueIdProperty="_id"
        enableRowSelection={false}
      />
    </div>
  );
}
