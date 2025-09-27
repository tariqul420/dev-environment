import OrdersPageWrapper from "@/components/dashboard/admin/orders-page-wrapper";
import { getOrdersForAdmin } from "@/lib/actions/order.action";

export const dynamic = "force-dynamic";

export default async function Orders({ searchParams }: any) {
  const { pageIndex, pageSize, search } = searchParams;

  const { orders, pagination } = await getOrdersForAdmin({
    limit: Number(pageSize || 20),
    page: Number(pageIndex || 1),
    search: search?.trim(),
  });

  return (
    <OrdersPageWrapper
      initialOrders={orders}
      totalItems={pagination.totalItems}
      pageIndex={Number(pageIndex || 1)}
      pageSize={Number(pageSize || 20)}
    />
  );
}
