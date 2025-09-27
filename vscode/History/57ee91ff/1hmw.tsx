export const dynamic = "force-dynamic";

import OrderRealtimeListener from "@/components/dashboard/admin/orders/order-realtime-listener";
import DataTable from "@/components/dashboard/data-table";
import { adminOrdersColumns } from "@/components/dashboard/table-columns";
import CalendarRange from "@/components/global/url/calender-range";
import SortSelect from "@/components/global/url/sort-select";
import StatusFilterPopover from "@/components/global/url/status-filter-popover";
import { deleteOrders, getOrdersForAdmin } from "@/lib/actions/order.action";

type OrderPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: OrderPageProps) {
  const {
    pageIndex,
    pageSize,
    search,
    dateFrom,
    dateTo,
    adminId,
    sortBy,
    status,
    sortDir,
  } = await searchParams;

  const adminIdForQuery =
    typeof adminId === "string" && adminId !== "_all_" ? adminId : undefined;

  const { orders, pagination, statusHistoryCount, admins } =
    await getOrdersForAdmin({
      limit: Number(pageSize || 25),
      page: Number(pageIndex || 1),
      search: typeof search === "string" ? search.trim() : "",
      dateFrom: typeof dateFrom === "string" ? dateFrom : undefined,
      dateTo: typeof dateTo === "string" ? dateTo : undefined,
      adminId: adminIdForQuery,
      status,
      sortBy: (typeof sortBy === "string" ? sortBy : "createdAt") as
        | "createdAt"
        | "status"
        | "admin"
        | "customerName"
        | "customerPhone"
        | "paymentMethod"
        | "total"
        | undefined,
      sortDir: (typeof sortDir === "string" ? sortDir : "desc") as
        | "asc"
        | "desc",
    });

  const adminItems = (list: { id: string; name: string }[]) => [
    { value: "_all_", label: "All admins" },
    ...list.map((a) => ({
      value: a.id,
      label: a.name || "Unnamed",
    })),
  ];

  return (
    <main>
      <OrderRealtimeListener />
      <DataTable<AdminOrderRow>
        data={orders as unknown as AdminOrderRow[]}
        columns={adminOrdersColumns || []}
        uniqueIdProperty="id"
        pageSize={Number(pageSize || "25")}
        pageIndex={Number(pageIndex || "1")}
        total={pagination.totalItems}
        onDeleteMany={deleteOrders}
        rightSite={
          <>
            <CalendarRange
              initialDateFrom={
                typeof dateFrom === "string" ? dateFrom : undefined
              }
              initialDateTo={typeof dateTo === "string" ? dateTo : undefined}
            />

            <StatusFilterPopover statusCounts={statusHistoryCount} />

            <SortSelect
              items={adminItems(admins)}
              paramKey="adminId"
              placeholder="All admins"
              defaultValue="_all_"
              ariaLabel="Filter by admin"
              className="w-auto"
            />

            <SortSelect
              paramKey="sortBy"
              placeholder="Sort by"
              defaultValue="createdAt"
              ariaLabel="Sort by"
              className="w-auto"
              items={[
                { value: "createdAt", label: "Created At" },
                { value: "status", label: "Status" },
                { value: "admin", label: "Admin" },
                { value: "customerName", label: "Customer Name" },
                { value: "customerPhone", label: "Customer Phone" },
                { value: "paymentMethod", label: "Payment Method" },
                { value: "total", label: "Total" },
              ]}
            />
          </>
        }
      />
    </main>
  );
}
