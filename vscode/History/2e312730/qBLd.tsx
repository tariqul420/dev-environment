export const revalidate = 36;

import FilterBar from "@/components/global/filter-bar";
import LoadMore from "@/components/global/load-more";
import NoResults from "@/components/global/no-results";
import BlogCard from "@/components/root/blogs/blog-card";
import RightSection from "@/components/root/blogs/right-section";
import { getBlogs } from "@/lib/actions/blog.action";
import { getCategories } from "@/lib/actions/category.action";
import { getProducts } from "@/lib/actions/product.action";
import { SearchParamsProps } from "@/types";
import { BlogCardProps } from "@/types/blog";

export default async function Blogs({ searchParams }: SearchParamsProps) {
  const { search, page, sort } = await searchParams;

  const [{ blogs = [], hasNextPage = false }, { products = [] }, categories] =
    await Promise.all([
      getBlogs({
        search: search?.trim(),
        page: Number(page) || 1,
        limit: 12,
        sort: sort || "default",
      }),
      getProducts({
        limit: 6,
        sort: "default",
      }),
      getCategories(),
    ]);

  return (
    <div className="py-12">
      <div className="flex flex-col gap-8 md:flex-row">
        <section className="w-full lg:w-3/4">
          {/* Top Navigation Bar */}
          <FilterBar categories={categories} page={page} products={products} />

          {/* Left side - blogs grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {blogs.length > 0 ? (
              blogs.map((post: BlogCardProps, index: number) => (
                <BlogCard key={index} post={post} />
              ))
            ) : (
              <NoResults
                className="col-span-full"
                title="No Blogs Found"
                description="We couldn't find what you're looking for. Try adjusting your filters or search terms."
              />
            )}
          </div>
          {hasNextPage && <LoadMore hasNextPage={hasNextPage} />}
        </section>

        {/* Right Sidebar - Filters */}
        <RightSection products={products} categories={categories} />
      </div>
    </div>
  );
}
