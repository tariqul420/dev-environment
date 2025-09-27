export const dynamic = "force-dynamic";

import DataTable from "@/components/dashboard/data-table";
import { customerOrdersColumns } from "@/components/dashboard/table-columns";
import { getOrdersForCustomer } from "@/lib/actions/order.action";
import { DashboardSearchParamsPros } from "@/types";

export default async function Orders({
  searchParams,
}: DashboardSearchParamsPros) {
  const { pageSize, pageIndex, search } = await searchParams;

  const { orders, pagination } = await getOrdersForCustomer({
    limit: Number(pageSize || 20),
    page: Number(pageIndex || 1),
    search: search?.trim(),
  });

  return (
    <>
      <DataTable
        pageIndex={Number(pageIndex || "1")}
        pageSize={Number(pageSize || "20")}
        total={pagination?.totalItems || 0}
        data={orders || []}
        columns={customerOrdersColumns || []}
        uniqueIdProperty="_id"
        enableRowSelection={false}
      />
    </>
  );
}
