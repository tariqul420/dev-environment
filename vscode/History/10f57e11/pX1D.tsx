export const revalidate = 60;

import NotFound from "@/app/not-found";
import ReviewForm from "@/components/dashboard/admin/review-form";
import { BreadcrumbContainer } from "@/components/global/breadcrumb-container";

import { getReviewById } from "@/lib/actions/review.action";

export default async function EditProduct({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const review = await getReviewById(id);
  if (!review) return <NotFound />;

  return (
    <section>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="container mx-auto max-w-4xl px-5 py-6">
          <BreadcrumbContainer
            className="mb-4"
            items={[
              { label: "Home", href: "/" },
              { label: "Dashboard", href: "/admin" },
              { label: "Products", href: "/admin/products" },
              { label: "Update Review" },
            ]}
          />
          <ReviewForm review={review} productSlug={slug} />
        </div>
      </div>
    </section>
  );
}
