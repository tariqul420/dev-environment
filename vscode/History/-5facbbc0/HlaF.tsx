export const dynamic = "force-dynamic";

import DataTable from "@/components/dashboard/data-table";
import { adminOrdersColumns } from "@/components/dashboard/table-columns";
import { deleteOrders, getOrdersForAdmin } from "@/lib/actions/order.action";
import { DashboardSearchParamsPros } from "@/types";

export default async function Orders({
  searchParams,
}: DashboardSearchParamsPros) {
  const { pageSize, pageIndex, search } = await searchParams;

  const { orders, pagination } = await getOrdersForAdmin({
    limit: Number(pageSize || 20),
    page: Number(pageIndex || 1),
    search: search?.trim(),
  });

  return (
    <section>
      <DataTable
        pageIndex={Number(pageIndex || "1")}
        pageSize={Number(pageSize || "10")}
        total={pagination?.totalItems || 0}
        data={orders || []}
        columns={adminOrdersColumns || []}
        uniqueIdProperty="_id"
        onDeleteMany={deleteOrders}
      />
    </section>
  );
}
