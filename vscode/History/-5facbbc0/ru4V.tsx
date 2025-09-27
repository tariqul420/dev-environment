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
    </>
  );
}
