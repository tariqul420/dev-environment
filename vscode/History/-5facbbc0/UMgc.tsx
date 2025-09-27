export const dynamic = "force-dynamic";

import OrderFilters from "@/components/dashboard/admin/order/order-filters";
import OrderRealtimeListener from "@/components/dashboard/admin/order/order-realtime-listener";
import DataTable from "@/components/dashboard/data-table";
import { adminOrdersColumns } from "@/components/dashboard/table-columns";
import CalendarRange from "@/components/global/calender-range";
import SortSelect from "@/components/global/sort-select";
import { deleteOrders, getOrdersForAdmin } from "@/lib/actions/order.action";

type Props = {
  searchParams: Promise<{
    pageSize: string;
    search: string;
    pageIndex: string;
    dateTo: string;
    dateFrom: string;
    adminId: string;
    sortBy: "name" | "orderId" | "status" | "admin" | "createdAt" | "updatedAt" | undefined;
    sortDir: "asc" | "desc" | undefined;
  }>;
}
type AdminItem = { _id: string; firstName?: string; lastName?: string; fullName?: string };

export default async function Orders({ searchParams }: Props) {
  const {
    pageIndex,
    pageSize,
    search,
    dateFrom,
    dateTo,
    adminId,
    sortBy,
    sortDir,
  } = await searchParams;

  const adminIdForQuery =
    adminId && adminId !== "_all_" ? adminId : undefined;

  const { orders, pagination, statusHistoryCount, admins } = await getOrdersForAdmin({
    limit: Number(pageSize || 20),
    page: Number(pageIndex || 1),
    search: search?.trim(),
    dateFrom,
    dateTo,
    adminId: adminIdForQuery,
    sortBy,
    sortDir,
  });

  const adminItems = (admins: AdminItem[]) => [
  { value: "_all_", label: "All admins" },
  ...admins.map((a) => ({
    value: a._id,
    label: (a.fullName || `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim()) || "Unnamed",
    })),
  ];

  const sortItems: [{value: string, label: string}] = [{value: "createdAt", label: "createdAt"}, {value: "updatedAt", label: "updatedAt"}]

  return (
    <>
      <OrderRealtimeListener />

      <OrderFilters
        admins={admins || []}
        statusCounts={statusHistoryCount || {}}
        initialSearch={search?.trim()}
        initialDateFrom={dateFrom}
        initialDateTo={dateTo}
        selectedAdminId={adminId}
      />

      <DataTable
        data={orders}
        columns={adminOrdersColumns}
        uniqueIdProperty="_id"
        pageSize={Number(pageSize || "20")}
        pageIndex={Number(pageIndex || "1")}
        total={pagination.totalItems}
        onDeleteMany={deleteOrders}
        rightSite={
        <>
        <CalendarRange initialDateFrom={dateFrom} initialDateTo={dateTo} />
        <SortSelect
          items={adminItems(admins)}
          paramKey="adminId"
          placeholder="All admins"
          defaultValue="_all_"
          ariaLabel="Filter by admin"
          className="w-auto"
        />
        </>
        }
      />
    </>
  );
}
