import ReviewForm from "@/components/dashboard/admin/product/review-form";
import { BreadcrumbContainer } from "@/components/global/breadcrumb-container";

export default async function AddReview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="container mx-auto max-w-4xl">
      <BreadcrumbContainer
        className="mb-4"
        items={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: "Add Review" },
        ]}
      />
      <ReviewForm productSlug={slug} />
    </div>
  );
}
