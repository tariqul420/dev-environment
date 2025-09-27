import NotFound from "@/app/not-found";
import ProductForm from "@/components/dashboard/admin/product-form";
import { BreadcrumbContainer } from "@/components/global/breadcrumb-container";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductBySlug } from "@/lib/actions/product.action";

export default async function EditProduct({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) return <NotFound />;

  return (
    <section>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="container mx-auto max-w-4xl px-5 py-6">
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
              <div className="text-center">
                Curriculum content will be added here
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
