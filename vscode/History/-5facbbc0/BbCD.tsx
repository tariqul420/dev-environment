import DataTable from "@/components/dashboard/data-table";
import { adminOrdersColumns } from "@/components/dashboard/table-columns";
import { getOrdersForAdmin } from "@/lib/actions/order.action";
import { DashboardSearchParamsPros } from "@/types";

export const dynamic = "force-dynamic";

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
      <NewOrderRefresher />
      <DataTable
        data={orders}
        columns={adminOrdersColumns}
        uniqueIdProperty="_id"
        pageIndex={Number(pageIndex || 1)}
        pageSize={Number(pageSize || 1)}
        total={pagination.totalItems}
        // তোমার DataTable আগের মতোই URL query change করে pagination/search করছে ধরেই নিচ্ছি
      />
      {/* <OrdersPageWrapper
        initialOrders={orders}
        totalItems={pagination.totalItems}
        pageIndex={Number(pageIndex || 1)}
        pageSize={Number(pageSize || 20)}
      /> */}
    </>
  );
}
