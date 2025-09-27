"use client";

import LoadMore from "@/components/global/load-more";
import NoResults from "@/components/global/no-results";
import { useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils/utils";
import { ProductProps } from "@/types/product";
import ProductCard from "./product-card";

export default function ProductsGrid({
  products,
  hasNextPage,
}: {
  products: ProductProps[];
  hasNextPage?: boolean;
}) {
  const viewMode = useAppSelector((state) => state.globals.viewMode);

  return (
    <>
      <div
        className={cn(
          "grid",
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
            : "grid-cols-2",
          "gap-6",
        )}
      >
        {products.length > 0 ? (
          products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))
        ) : (
          <div className="col-span-full">
            <NoResults
              title="No Products Found"
              description="We couldn't find what you're looking for. Try adjusting your filters or search terms."
            />
          </div>
        )}
      </div>
      {hasNextPage && <LoadMore hasNextPage />}
    </>
  );
}
