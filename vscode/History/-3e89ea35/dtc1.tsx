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
                <h2 className="mb-4 text-2xl font-bold">
                  Natural SEFA Update Product Review
                </h2>
                <p className="mb-2 text-lg">
                  The <strong>Natural SEFA Update</strong> is a cutting-edge
                  software solution designed for the mining industry,
                  streamlining environmental compliance and operational
                  efficiency. This tool integrates seamlessly with existing
                  mining systems to provide real-time updates on Sustainable
                  Environmental and Financial Assessments (SEFA), ensuring
                  companies stay ahead of regulatory requirements while
                  optimizing resource extraction.
                </p>
                <p className="mb-2 text-lg">
                  <strong>Key Features:</strong>
                  <ul className="mx-auto max-w-2xl list-inside list-disc">
                    <li>
                      Automated compliance tracking for environmental
                      regulations.
                    </li>
                    <li>
                      Real-time data analytics for ore processing and waste
                      management.
                    </li>
                    <li>
                      User-friendly interface with customizable dashboards.
                    </li>
                    <li>
                      Integration with IoT devices for on-site monitoring.
                    </li>
                  </ul>
                </p>
                <p className="mb-2 text-lg">
                  <strong>Pros:</strong> The software’s intuitive design reduces
                  training time, and its robust analytics help identify
                  cost-saving opportunities. Users report a 20% improvement in
                  compliance audit efficiency.
                </p>
                <p className="mb-2 text-lg">
                  <strong>Cons:</strong> Initial setup can be complex for
                  smaller operations, and the subscription cost may be high for
                  startups.
                </p>
                <p className="text-lg font-semibold">
                  <strong>Verdict:</strong> Natural SEFA Update is a powerful
                  tool for mid-to-large mining companies looking to enhance
                  sustainability and efficiency. While the price point may deter
                  smaller firms, its comprehensive features make it a worthwhile
                  investment for those prioritizing compliance and data-driven
                  decisions.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
