export const dynamic = "force-dynamic";

import { getOrdersForCustomer } from "@/lib/actions/order.action";
import type { DashboardSearchParamsPros } from "@/types";

export default async function Orders({
  searchParams,
}: DashboardSearchParamsPros) {
  const { pageSize, pageIndex, search } = await searchParams;

  const { orders, pagination } = await getOrdersForCustomer({
    limit: Number(pageSize || 20),
    page: Number(pageIndex || 1),
    search: search?.trim(),
  });

  console.log(orders, pagination);

  return (
    <>
      {/* <DataTable
        pageIndex={Number(pageIndex || "1")}
        pageSize={Number(pageSize || "20")}
        total={pagination?.totalItems || 0}
        data={orders || []}
        columns={customerOrdersColumns || []}
        uniqueIdProperty="_id"
        enableRowSelection={false}
      /> */}
      <div className="p-4">Orders Page</div>
      <pre>{JSON.stringify(orders, null, 2)}</pre>
    </>
  );
}
