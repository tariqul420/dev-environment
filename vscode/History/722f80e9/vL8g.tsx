export const dynamic = "force-dynamic";

import DataTable from "@/components/dashboard/data-table";
import { adminCategoryColumns } from "@/components/dashboard/table-columns";
import {
  deleteCategories,
  getCategoriesForAdmin,
} from "@/lib/actions/category.action";
import { DashboardSearchParamsPros } from "@/types";

export default async function Categories({
  searchParams,
}: DashboardSearchParamsPros) {
  const { pageSize, pageIndex, search } = await searchParams;

  const { categories, pagination } = await getCategoriesForAdmin({
    limit: Number(pageSize || 20),
    page: Number(pageIndex || 1),
    search: search?.trim(),
  });

  return (
    <section>
      <div className="@container/main flex flex-1 flex-col gap-2 px-4 py-4 lg:px-6">
        <DataTable
          pageIndex={Number(pageIndex || "1")}
          pageSize={Number(pageSize || "10")}
          total={pagination?.totalItems || 0}
          data={categories || []}
          columns={adminCategoryColumns || []}
          uniqueIdProperty="_id"
          onDeleteMany={deleteCategories}
        />
      </div>
    </section>
  );
}
