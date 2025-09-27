import { TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import FilterBar from "@/components/global/url/filter-bar";
import ProductsGrid from "@/components/root/products/products-grid";
import { getAllCategories } from "@/lib/actions/category.action";
import { getAllProducts } from "@/lib/actions/product.action";
import { setQuery, withPageReset } from "@/lib/utils/url-helpers";

export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}): string {
  const s = new URLSearchParams(params || "");
  if (value === null || value === "") s.delete(key);
  else s.set(key, value);
  const qs = s.toString();
  return qs ? `/products?${qs}` : "/products";
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: {
  params: string;
  keysToRemove: string[];
}): string {
  const s = new URLSearchParams(params || "");
  keysToRemove.forEach((k) => {
    s.delete(k);
  });
  const qs = s.toString();
  return qs ? `/products?${qs}` : "/products";
}

export const toYMD = (d?: Date) =>
  d ? new Date(d).toISOString().slice(0, 10) : undefined;

export function getCsvParam(sp: URLSearchParams | null, key: string): string[] {
  if (!sp) return [];
  const v = sp.get(key);
  return v
    ? v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
}

export function setCsvParam(
  prevQS: string,
  key: string,
  values: string[],
  resetPage = true,
): string {
  const pairs: Record<string, string | undefined> = {
    [key]: values.length ? values.join(",") : undefined,
  };
  return resetPage
    ? setQuery(prevQS, withPageReset(pairs))
    : setQuery(prevQS, pairs);
}

export function arraysShallowEqual(
  a: readonly string[],
  b: readonly string[],
): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

type SortType = "default" | "newest" | "oldest" | "price-low" | "price-high";

type SearchParams = {
  search?: string | string[];
  page?: string | string[];
  sort?: SortType | string[];
  category?: string | string[];
};

type CategoryItem = {
  id: string;
  name: string;
  slug?: string | null;
};

function qsFromSearchParams(sp: Record<string, unknown>): string {
  const s = new URLSearchParams();
  Object.entries(sp).forEach(([k, v]) => {
    if (v == null) return;
    if (Array.isArray(v)) {
      if (v[0] != null && v[0] !== "") s.set(k, String(v[0]));
    } else if (v !== "") {
      s.set(k, String(v));
    }
  });
  return s.toString();
}

function makeAllHref(currentQS: string): string {
  return removeKeysFromQuery({ params: currentQS, keysToRemove: ["category"] });
}

function makeCategoryHref(
  currentQS: string,
  categoryValue: string,
  resetPage = true,
): string {
  const nextQS = resetPage
    ? setQuery(currentQS, withPageReset({ category: categoryValue }))
    : setQuery(currentQS, { category: categoryValue });
  return nextQS ? `/products?${nextQS}` : "/products";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
 const { search, page, sort, category } = await searchParams;

  const currentQS = qsFromSearchParams({ search, page, sort, category });

  const [{ products = [], hasNextPage = false }, categories] = await Promise.all([
    getAllProducts({
      search: Array.isArray(search) ? search[0]?.trim() : search?.trim(),
      page: Number(page) || 1,
      limit: 12,
      sort: Array.isArray(sort)
        ? (sort[0] as SortType) || "default"
        : (sort as SortType) || "default",
      category: Array.isArray(category) ? category[0] : category,
    }),
    getAllCategories(),
  ]);

  const hasCategories = Array.isArray(categories) && categories.length > 0;
  const isAllActive = !category;

  const baseLink = "block rounded-md px-3 py-2 text-sm font-medium transition";
  const activeLink = "bg-accent text-accent-foreground";
  const idleLink =
    "text-muted-foreground hover:bg-accent hover:text-accent-foreground";

  return (
    <main className="py-10 space-y-4">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Left Sidebar - Filters */}
        <aside className="hidden w-full md:w-1/4 lg:block">
          <h2 className="mb-4 text-lg font-semibold tracking-wide uppercase">
            Product Categories
          </h2>

          {hasCategories ? (
            <ul className="space-y-2">
              <li>
                <Link
                  href={makeAllHref(currentQS)}
                  aria-current={isAllActive ? "page" : undefined}
                  className={`${baseLink} ${isAllActive ? activeLink : idleLink}`}
                >
                  All Categories
                </Link>
              </li>

              {categories.map((c: CategoryItem) => {
                const catValue = c.slug ?? c.id;
                const isActive = sp.category === catValue;
                return (
                  <li key={c.id}>
                    <Link
                      href={makeCategoryHref(currentQS, catValue)}
                      aria-current={isActive ? "page" : undefined}
                      className={`${baseLink} ${isActive ? activeLink : idleLink}`}
                    >
                      {c.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
              <TriangleAlertIcon size={16} className="mr-2 inline-block" />
              No categories available at the moment.
              <br />
              Please check back later.
            </div>
          )}
        </aside>

        {/* Right Side - Products Display */}
        <section className="w-full lg:w-3/4">
          {/* Top Navigation / Filters */}
          <FilterBar categories={categories} page={sp.page} />

          {/* Products Grid */}
          <ProductsGrid products={products} hasNextPage={hasNextPage} />
        </section>
      </div>
    </main>
  );
}
