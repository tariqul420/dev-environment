"use client";

import MyButton from "@/components/global/my-btn";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { ProductProps } from "@/types/product";
import { Tag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import QuantityInput from "./quantity-input";
import QuantityPrice from "./quantity-price";

export default function ProductCard({ product }: { product: ProductProps }) {
  const router = useRouter();
  const quantity = useAppSelector((s) => s.globals.productQuantity);
  const [imgSrc, setImgSrc] = useState(
    product.imageUrls?.[0] || "/assets/placeholder.png",
  );
  const [imgLoaded, setImgLoaded] = useState(false);

  const goToDetails = useCallback(() => {
    router.push(`/products/${product.slug}`);
  }, [router, product.slug]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToDetails();
    }
  };

  const priceBlock = useMemo(
    () => (
      <QuantityPrice
        originalPrice={product.regularPrice}
        salePrice={product.salePrice}
        className="font-grotesk text-center text-lg"
      />
    ),
    [product.regularPrice, product.salePrice],
  );

  return (
    <div
      className={cn(
        // Gradient border wrap
        "rounded-2xl p-[1px] transition-all",
        "from-accent-main/30 bg-gradient-to-b via-transparent to-transparent",
        "hover:from-accent-main/50 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,.25)]",
      )}
    >
      <Card
        role="button"
        tabIndex={0}
        onClick={goToDetails}
        onKeyDown={onKeyDown}
        className={cn(
          "group relative flex h-full cursor-pointer flex-col rounded-2xl",
          "dark:bg-dark-lite/90 bg-white/90 backdrop-blur-sm transition-shadow duration-300",
          "focus-visible:ring-accent-main focus:outline-none focus-visible:ring-2",
        )}
      >
        {/* Ribbon / Tag */}
        {product.tag && (
          <div className="pointer-events-none absolute top-4 left-4 z-10">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium text-white shadow-sm",
                "bg-gradient-to-r from-rose-500 via-red-500 to-amber-500",
              )}
            >
              <Tag size={14} className="opacity-90" />
              {product.tag}
            </span>
          </div>
        )}

        <CardHeader className="relative">
          <div className="relative h-48 w-full overflow-hidden rounded-xl">
            {/* Shimmer skeleton while loading */}
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse rounded-xl bg-black/5 dark:bg-white/5" />
            )}
            <Image
              src={imgSrc}
              alt={product.title}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImgSrc("/assets/placeholder.png")}
              onLoadingComplete={() => setImgLoaded(true)}
              className={cn(
                "object-cover transition-transform duration-500",
                "group-hover:scale-[1.05]",
              )}
            />
          </div>
        </CardHeader>

        <CardContent className="flex flex-grow flex-col gap-2 pt-0">
          {/* Title */}
          <h3 className="mx-auto mb-1 line-clamp-1 text-center">
            <span className="font-grotesk text-xl font-semibold capitalize">
              {product.title}
            </span>{" "}
            <span className="font-grotesk text-xl">·</span>{" "}
            <span className="text-foreground/90 text-lg font-medium capitalize">
              {product.titleBengali}
            </span>
          </h3>

          {/* Package chip */}
          {product.packageDuration && (
            <div className="flex justify-center">
              <span className="bg-foreground/[0.06] text-foreground/80 rounded-full px-3 py-1 text-xs font-medium capitalize dark:bg-white/5">
                {product.packageDuration}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mt-1">{priceBlock}</div>

          {/* Controls */}
          <div
            className="mt-2 flex items-center justify-center gap-4"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <QuantityInput />
          </div>
        </CardContent>

        <CardFooter
          onClick={(e) => e.stopPropagation()}
          className="mt-2 flex flex-col gap-3 pt-0"
        >
          <Separator className="bg-foreground/5" />
          <MyButton
            className={cn(
              "w-full rounded-xl py-5 text-base font-semibold",
              "transition-transform hover:translate-y-[-1px]",
            )}
            href={`/checkout?slug=${product.slug}&quantity=${quantity}`}
          >
            অর্ডার করুন
          </MyButton>
        </CardFooter>
      </Card>
    </div>
  );
}
