export const dynamic = "force-dynamic";

import OrderRealtimeListener from "@/components/dashboard/admin/order/order-realtime-listener";
import DataTable from "@/components/dashboard/data-table";
import { adminOrdersColumns } from "@/components/dashboard/table-columns";
import { deleteOrders, getOrdersForAdmin } from "@/lib/actions/order.action";
import { DashboardSearchParamsPros } from "@/types";

export default async function Orders({
  searchParams,
}: DashboardSearchParamsPros) {
  const { pageIndex, pageSize, search } = await searchParams;

  const { orders, pagination } = await getOrdersForAdmin({
    limit: Number(pageSize || 20),
    page: Number(pageIndex || 1),
    search: search?.trim(),
  });

  return (
    <>
      <OrderRealtimeListener />
      <DataTable
        data={orders}
        columns={adminOrdersColumns}
        uniqueIdProperty="_id"
        pageSize={Number(pageSize || "20")}
        pageIndex={Number(pageIndex || "1")}
        total={pagination.totalItems}
        onDeleteMany={deleteOrders}
      />
    </>
  );
}
