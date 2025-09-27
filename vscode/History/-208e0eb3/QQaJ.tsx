import FilterBar from "@/components/global/filter-bar";
import ProductsGrid from "@/components/root/products/products-grid";
import { getCategories } from "@/lib/actions/category.action";
import { getProducts } from "@/lib/actions/product.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";

export default async function Products({ searchParams }: SearchParamsProps) {
  const { search, page, sort, category } = await searchParams;

  const [{ products = [], hasNextPage = false }, categories] =
    await Promise.all([
      getProducts({
        search: search?.trim(),
        page: Number(page) || 1,
        limit: 12,
        sort: sort || "default",
        category: category,
      }),
      getCategories(),
    ]);

  return (
    <div className="py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Left Sidebar - Filters */}
        <div className="hidden w-full md:w-1/4 lg:block">
          <div>
            <h2 className="mb-4 text-xl font-semibold uppercase">
              PRODUCT CATEGORIES
            </h2>
            <ul className="space-y-3">
              {categories.map((category: { name: string; slug: string }) => (
                <li key={category.slug} className="hover:text-accent-main">
                  <Link href={`/products?category=${category.slug}`}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side - Products Display */}
        <div className="w-full lg:w-3/4">
          {/* Top Navigation Bar */}
          <FilterBar categories={categories} page={page} />

          {/* Products Grid */}
          <ProductsGrid products={products} hasNextPage={hasNextPage} />
        </div>
      </div>
    </div>
  );
}
