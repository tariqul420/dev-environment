"use client";

import { format } from "date-fns";
import { Calendar, TableOfContents } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { translateToEnglish } from "@/lib/utils/translator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import { BreadcrumbContainer } from "../breadcrumb-container";
import SearchBar from "./search-bar";
import SortSelect from "./sort-select";

const FilterBar = ({
  categories,
  page,
  products,
  blog,
}: {
  categories: { name: string; id: string }[];
  page?: string;
  products?: ProductProps[];
  blog?: { title: string; slug?: string; createdAt: string };
}) => {
  const pathname = usePathname();
  const safePathname = pathname ?? "";

  const isBlogPath = safePathname.startsWith("/blogs");
  const [translatedTitle, setTranslatedTitle] = useState<string>("");

  useEffect(() => {
    const translateTitle = async () => {
      if (blog?.title) {
        const data = await translateToEnglish(blog?.title);
        setTranslatedTitle(data);
      }
    };

    translateTitle();
  }, [blog?.title]);

  return (
    <div className="mb-6 flex min-h-[60px] flex-col justify-between rounded border-b pb-4 md:flex-row">
      <div className="left-content order-2 mt-5 flex items-center justify-between gap-4 md:order-1 md:mt-0">
        <Sheet>
          <SheetTrigger>
            <TableOfContents className="block lg:hidden" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="z-50 block w-[300px] px-2.5 sm:w-[540px] md:px-5 lg:hidden"
          >
            <div className="h-full overflow-y-auto">
              {isBlogPath && products && (
                <div className="mb-8">
                  <SheetHeader>
                    <SheetTitle className="font-grotesk text-xl font-semibold uppercase">
                      FEATURED PRODUCTS
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4">
                    {products.map((product: ProductProps) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="group flex items-center gap-4 rounded-lg border p-2 transition-all"
                      >
                        <div className="h-20 w-20 flex-shrink-0 rounded-md">
                          <Image
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.title}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-md mb-1 line-clamp-2 font-medium">
                            {product.title}
                          </h3>
                          <p className="en mb-auto">
                            <span className="line-through">
                              {product.compareAtPrice} ৳
                            </span>{" "}
                            -{" "}
                            <span className="text-accent-main text-lg font-bold">
                              {product.price} ৳
                            </span>
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <div className="font-grotesk">
                <SheetHeader>
                  <SheetTitle className="text-xl font-semibold uppercase">
                    PRODUCT CATEGORIES
                  </SheetTitle>
                </SheetHeader>
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li key={category.id} className="hover:text-accent-hover">
                      <SheetClose asChild>
                        <Link href={`/products?category=${category.id}`}>
                          {category.name}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <BreadcrumbContainer
          items={[
            { label: "Home", href: "/" },
            ...(safePathname === "/products"
              ? [{ label: "Shop", href: "/products" }]
              : []),
            ...(safePathname.startsWith("/blogs")
              ? [
                  { label: "Blog", href: "/blogs" },
                  ...(blog
                    ? [
                        {
                          label:
                            (translatedTitle || blog.title).length > 20
                              ? `${(translatedTitle || blog.title).slice(
                                  0,
                                  20,
                                )}...`
                              : translatedTitle || blog.title,
                        },
                      ]
                    : []),
                ]
              : []),
            ...(!blog ? [{ label: `Page ${page || 1}` }] : []),
          ]}
        />
      </div>

      <div className="right-content order-1 flex flex-col items-start gap-2 sm:flex-row sm:items-center md:order-2 md:gap-5">
        {blog && (
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <p>{format(new Date(blog.createdAt), "PPP")}</p>
          </div>
        )}

        {(safePathname === "/products" || safePathname === "/blogs") && (
          <>
            <div className="w-full sm:w-auto">
              <Suspense
                fallback={
                  <div className="dark:bg-dark-lite h-10 w-32 animate-pulse rounded bg-gray-200" />
                }
              >
                <SearchBar
                  placeholder={
                    safePathname === "/products"
                      ? "Search Products..."
                      : "Search Blogs..."
                  }
                />
              </Suspense>
            </div>

            <div className="w-full sm:w-auto">
              <Suspense
                fallback={
                  <div className="dark:bg-dark-lite h-10 w-32 animate-pulse rounded bg-gray-200" />
                }
              >
                {isBlogPath ? (
                  <SortSelect
                    defaultValue="default"
                    items={[
                      { value: "default", label: "Default" },
                      { value: "newest", label: "Newest first" },
                      { value: "oldest", label: "Oldest first" },
                    ]}
                  />
                ) : (
                  <SortSelect
                    defaultValue="default"
                    items={[
                      { value: "default", label: "Default" },
                      { value: "newest", label: "Newest first" },
                      { value: "oldest", label: "Oldest first" },
                      { value: "price-low", label: "Price: Low → High" },
                      { value: "price-high", label: "Price: High → Low" },
                    ]}
                  />
                )}
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
