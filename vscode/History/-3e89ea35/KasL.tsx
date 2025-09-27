export const revalidate = 60;

import ProductForm from "@/components/dashboard/admin/product/product-form";
import DataTable from "@/components/dashboard/data-table";
import { adminReviewsColumns } from "@/components/dashboard/table-columns";
import { BreadcrumbContainer } from "@/components/global/breadcrumb-container";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductBySlug } from "@/lib/actions/product.action";
import { deleteReviews, getReviewsForAdmin } from "@/lib/actions/review.action";

export default async function EditProduct({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    pageSize?: string;
    pageIndex?: string;
    search?: string;
  }>;
}) {
  const { slug } = await params;
  const { pageSize, pageIndex, search } = await searchParams;

  const product = await getProductBySlug(slug);
  const { reviews, pagination } = await getReviewsForAdmin({
    productSlug: slug,
    limit: Number(pageSize || 20),
    page: Number(pageIndex || 1),
    search: search?.trim(),
  });

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <BreadcrumbContainer
        className="mb-4"
        items={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/admin" },
          { label: "Update Product" },
        ]}
      />
      <Tabs defaultValue="basic">
        <TabsList className="w-full rounded text-center">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <ProductForm product={product} />
        </TabsContent>

        <TabsContent value="review">
          <DataTable
            pageIndex={Number(pageIndex || "1")}
            pageSize={Number(pageSize || "20")}
            total={pagination?.totalItems || 0}
            data={reviews || []}
            columns={adminReviewsColumns || []}
            uniqueIdProperty="_id"
            onDeleteMany={deleteReviews}
            actionLink={{
              href: `/admin/products/${slug}/add-review`,
              label: "Add Review",
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
