// app/(dashboard)/admin/orders/page.tsx
import NewOrderRefresher from "@/components/dashboard/admin/new-order-refresher";
import DataTable from "@/components/dashboard/data-table";
import { adminOrdersColumns } from "@/components/dashboard/table-columns";
import { getOrdersForAdmin } from "@/lib/actions/order.action";

export const dynamic = "force-dynamic";

export default async function Orders({ searchParams }: { searchParams: any }) {
  const pageIndex = Number(searchParams?.pageIndex || 1);
  const pageSize = Number(searchParams?.pageSize || 20);
  const search = (searchParams?.search || "").trim();

  const { orders, pagination } = await getOrdersForAdmin({
    page: pageIndex,
    limit: pageSize,
    search,
  });

  return (
    <>
      {/* শুধুমাত্র new-order ধরবে এবং router.refresh() করবে */}
      <NewOrderRefresher />

      <DataTable
        data={orders}
        columns={adminOrdersColumns}
        uniqueIdProperty="_id"
        pageIndex={pageIndex}
        pageSize={pageSize}
        total={pagination.totalItems}
        // তোমার DataTable আগের মতোই URL query change করে pagination/search করছে ধরেই নিচ্ছি
      />
    </>
  );
}
