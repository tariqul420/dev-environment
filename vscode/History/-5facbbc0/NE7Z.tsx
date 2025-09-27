import OrdersPageWrapper from "@/components/dashboard/admin/order/orders-page-wrapper";
import { deleteOrders, getOrdersForAdmin } from "@/lib/actions/order.action";
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
      <DataTable
        pageIndex={pageIndex}
        pageSize={pageSize}
        total={pagination.totalItems}
        data={orders}
        columns={adminOrdersColumns}
        uniqueIdProperty="_id"
        onDeleteMany={deleteOrders}
      />
      <OrdersPageWrapper
        initialOrders={orders}
        totalItems={pagination.totalItems}
        pageIndex={Number(pageIndex || 1)}
        pageSize={Number(pageSize || 20)}
      />
    </>
  );
}
