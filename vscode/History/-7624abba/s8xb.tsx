"use client";

import {
  Calendar,
  LayoutGrid,
  LayoutList,
  TableOfContents,
} from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

import { BreadcrumbContainer } from "@/components/global/breadcrumb-container";
import { setViewMode } from "@/lib/features/global/global-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ProductProps } from "@/types/product";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import SearchBar from "./search-bar";

import SortSelect from "./sort-select";
import { translateToEnglish } from "./translator";

const FilterBar = ({
  categories,
  page,
  products,
  blog,
}: {
  categories: { name: string; slug: string }[];
  page?: string;
  products?: ProductProps[];
  blog?: { title: string; slug?: string; createdAt: string };
}) => {
  const pathname = usePathname();
  const safePathname = pathname ?? "";

  const viewMode = useAppSelector((state) => state.globals.viewMode);
  const dispatch = useAppDispatch();
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
                        key={product.slug}
                        href={`/products/${product.slug}`}
                        className="group flex items-center gap-4 rounded-lg border p-2 transition-all"
                      >
                        <div className="h-20 w-20 flex-shrink-0 rounded-md">
                          <Image
                            src={product.imageUrls[0]}
                            alt={product.title}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-md mb-1 line-clamp-2 font-medium">
                            <span className="en text-md font-semibold">
                              {product.title}
                            </span>{" "}
                            -{" "}
                            <span className="text-base font-medium">
                              {product.titleBengali}
                            </span>
                          </h3>
                          <p className="en mb-auto">
                            <span className="line-through">
                              {product.regularPrice} ৳
                            </span>{" "}
                            -{" "}
                            <span className="text-accent-main text-lg font-bold">
                              {product.salePrice} ৳
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
                    <li key={category.slug} className="hover:text-accent-hover">
                      <SheetClose asChild>
                        <Link href={`/products?category=${category.slug}`}>
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

            {safePathname === "/products" && (
              <div className="hidden items-center gap-2 lg:flex">
                <button
                  onClick={() => dispatch(setViewMode("grid"))}
                  className={`p-1 ${viewMode === "grid" ? "text-accent-main" : "text-gray-400"}`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => dispatch(setViewMode("list"))}
                  className={`p-1 ${viewMode === "list" ? "text-accent-main" : "text-gray-400"}`}
                >
                  <LayoutList size={20} />
                </button>
              </div>
            )}

            <div className="w-full sm:w-auto">
              <Suspense
                fallback={
                  <div className="dark:bg-dark-lite h-10 w-32 animate-pulse rounded bg-gray-200" />
                }
              >
                <SortSelect />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
