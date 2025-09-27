export const dynamic = "force-dynamic";

import DataTable from "@/components/dashboard/data-table";
import { getUsersForAdmin } from "@/lib/actions/user.action";

export default async function Users({ searchParams }: DashboardPros) {
  const { pageSize, pageIndex, search } = await searchParams;

  const { users, pagination } = await getUsersForAdmin({
    limit: Number(pageSize || 20),
    page: Number(pageIndex || 1),
    search: search?.trim(),
  });

  return (
    <main>
      <DataTable
        pageIndex={Number(pageIndex || "1")}
        pageSize={Number(pageSize || "25")}
        total={pagination?.totalItems || 0}
        data={users || []}
        columns={adminUserColumns || []}
        actionLink={{
          href: "/admin/products/add",
          label: "Add Product",
        }}
      />
    </main>
  );
}
