export const dynamic = "force-dynamic";

import DataTable from "@/components/dashboard/data-table";
import { adminCategoryColumns } from "@/components/dashboard/table-columns";
import {
  deleteCategories,
  getCategoriesForAdmin,
} from "@/lib/actions/category.action";

export default async function Categories({ searchParams }: DashboardPros) {
  const { pageSize, pageIndex, search } = await searchParams;

  const { categories, pagination } = await getCategoriesForAdmin({
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
        data={categories || []}
        columns={adminCategoryColumns || []}
        onDeleteMany={deleteCategories}
        actionLink={{
          href: "/admin/products/add",
          label: "Add Product",
        }}
      />
    </main>
  );
}
