export const dynamic = "force-dynamic";

import DataTable from "@/components/dashboard/data-table";
import { customerOrdersColumns } from "@/components/dashboard/table-columns";
import { getOrdersForCustomer } from "@/lib/actions/order.action";

export default async function Orders({ searchParams }: DashboardPros) {
  const { pageSize, pageIndex, search } = await searchParams;

  const { orders, pagination } = await getOrdersForCustomer({
    limit: Number(pageSize || 25),
    page: Number(pageIndex || 1),
    search: search?.trim(),
  });

  console.log(orders);

  return (
    <main>
      <DataTable
        pageIndex={Number(pageIndex || "1")}
        pageSize={Number(pageSize || "25")}
        total={pagination?.totalItems || 0}
        data={orders || []}
        columns={customerOrdersColumns || []}
        enableRowSelection={false}
      />
    </main>
  );
}
