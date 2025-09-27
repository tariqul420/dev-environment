export const revalidate = 60;

import NotFound from "@/app/not-found";
import ContentContainer from "@/components/global/content-container";
import FilterBar from "@/components/global/filter-bar";
import RightSection from "@/components/root/blogs/right-section";
import { getBlogBySlug } from "@/lib/actions/blog.action";
import { getCategories } from "@/lib/actions/category.action";
import { getProducts } from "@/lib/actions/product.action";
import { SlugParams } from "@/types";
import { BlogCardProps } from "@/types/blog";
import { ICategory } from "@/types/category";
import { ProductProps } from "@/types/product";
import Image from "next/image";

export default async function BlogDetails({ params }: SlugParams) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const [blog, { products = [] }, categories]: [
    blog: BlogCardProps,
    { products: ProductProps[] },
    categories: ICategory[],
  ] = await Promise.all([
    getBlogBySlug(decodedSlug),
    getProducts({
      limit: 6,
      sort: "default",
    }),
    getCategories(),
  ]);

  if (!blog) return <NotFound />;

  const blogDataForFilter = {
    title: blog.title,
    slug: blog.slug,
    createdAt: blog.createdAt,
  };

  return (
    <div className="py-12">
      <div className="flex flex-col gap-8 md:flex-row">
        <section className="w-full lg:w-3/4">
          {/* Top Navigation Bar */}
          <FilterBar
            products={products}
            categories={categories}
            blog={blogDataForFilter}
          />
          {/* Left side - blog details */}
          <p>{blog.description}</p>
          <div className="my-10 w-full overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <Image
              src={blog.image}
              alt={blog.title}
              width={1200}
              height={630}
              className="aspect-video h-auto w-full object-cover"
              priority
            />
          </div>
          <ContentContainer content={blog.content} />
        </section>

        {/* Right Sidebar - Filters */}
        <RightSection products={products} categories={categories} />
      </div>
    </div>
  );
}
