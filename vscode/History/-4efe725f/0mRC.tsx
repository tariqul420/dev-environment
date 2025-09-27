export const dynamic = "force-dynamic";

import DataTable from "@/components/dashboard/data-table";
import { adminProductsColumns } from "@/components/dashboard/table-columns";
import {
  deleteProducts,
  getProductsForAdmin,
} from "@/lib/actions/product.action";
import { DashboardSearchParamsPros } from "@/types";

export default async function Products({
  searchParams,
}: DashboardSearchParamsPros) {
  const { pageSize, pageIndex, search } = await searchParams;

  const { products, pagination } = await getProductsForAdmin({
    limit: Number(pageSize || 20),
    page: Number(pageIndex || 1),
    search: search?.trim(),
  });

  return (
    <section>
      <DataTable
        pageIndex={Number(pageIndex || "1")}
        pageSize={Number(pageSize || "10")}
        total={pagination?.totalItems || 0}
        data={products || []}
        columns={adminProductsColumns || []}
        uniqueIdProperty="_id"
        onDeleteMany={deleteProducts}
        actionLink={{
          href: "/admin/products/add-product",
          label: "Add Product",
        }}
      />
    </section>
  );
}
