export const dynamic = "force-dynamic";

import { getOrdersForCustomer } from "@/lib/actions/order.action";

export default async function Orders({ searchParams }: DashboardPros) {
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
        enableRowSelection={false}
      /> */}
    </>
  );
}
