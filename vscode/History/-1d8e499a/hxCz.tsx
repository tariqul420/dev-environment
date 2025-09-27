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
import { useCallback, useState } from "react";
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

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={goToDetails}
      className={cn(
        "group flex h-full flex-col transition-shadow hover:shadow-lg",
        "focus-visible:ring-accent-main focus:outline-none focus-visible:ring-2",
      )}
    >
      <CardHeader className="relative p-0">
        {product.tag && (
          <div className="absolute top-3 left-3 z-10 rounded-full bg-red-500/90 px-2.5 py-1 text-xs font-medium text-white shadow">
            <Tag size={12} className="mr-1 inline-block" />
            {product.tag}
          </div>
        )}

        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          {!imgLoaded && (
            <div className="bg-muted absolute inset-0 animate-pulse" />
          )}
          <Image
            src={imgSrc}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc("/assets/placeholder.png")}
            onLoadingComplete={() => setImgLoaded(true)}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-grow flex-col gap-2 pt-4">
        <h3 className="font-grotesk line-clamp-1 text-center text-xl font-semibold capitalize">
          {product.title} -{" "}
          <span className="text-muted-foreground text-lg font-medium capitalize">
            {product.titleBengali}
          </span>
        </h3>

        {product.packageDuration && (
          <p className="text-muted-foreground text-center text-sm capitalize">
            {product.packageDuration}
          </p>
        )}

        <QuantityPrice
          originalPrice={product.regularPrice}
          salePrice={product.salePrice}
          className="mb-2 text-center text-lg"
        />

        <div
          className="flex justify-center"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <QuantityInput />
        </div>
      </CardContent>

      <CardFooter
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-3 pt-0"
      >
        <Separator />
        <MyButton
          href={`/checkout?slug=${product.slug}&quantity=${quantity}`}
          className="w-full"
        >
          অর্ডার করুন
        </MyButton>
      </CardFooter>
    </Card>
  );
}
