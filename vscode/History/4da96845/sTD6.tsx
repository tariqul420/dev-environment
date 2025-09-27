export const dynamic = "force-dynamic";

import DataTable from "@/components/dashboard/data-table";
import { adminUsersColumns } from "@/components/dashboard/table-columns";
import { getUsersForAdmin } from "@/lib/actions/user.action";
import { DashboardSearchParamsPros } from "@/types";

export default async function Customers({
  searchParams,
}: DashboardSearchParamsPros) {
  const { pageSize, pageIndex, search } = await searchParams;

  const { users, pagination } = await getUsersForAdmin({
    limit: Number(pageSize || 20),
    page: Number(pageIndex || 1),
    search: search?.trim(),
  });

  return (
    <>
      <DataTable
        pageIndex={Number(pageIndex || "1")}
        pageSize={Number(pageSize || "20")}
        total={pagination?.totalItems || 0}
        data={users || []}
        columns={adminUsersColumns || []}
        uniqueIdProperty="_id"
        enableRowSelection={false}
      />
    </>
  );
}
