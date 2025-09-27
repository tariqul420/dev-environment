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
import { Tag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import QuantityInput from "./quantity-input";
import QuantityPrice from "./quantity-price";

export interface ProductProps {
  _id: string;
  slug: string;
  title: string;
  titleBengali: string;
  packageDuration?: string;
  imageUrls: string[];
  regularPrice: number;
  salePrice: number;
  tag?: string;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState(
    product.imageUrls?.[0] || "/assets/placeholder.png",
  );
  const quantity = useAppSelector((s) => s.globals.productQuantity);

  const goToDetails = useCallback(() => {
    router.push(`/products/${product.slug}`);
  }, [router, product.slug]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToDetails();
    }
  };

  const handleImgError = () => setImgSrc("/assets/placeholder.png");

  // Inner Buy Now — always uses global quantity
  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/checkout?slug=${product.slug}&quantity=${quantity}`);
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={goToDetails}
      onKeyDown={onKeyDown}
      className={cn(
        "group focus:ring-accent-main flex h-full cursor-pointer flex-col transition-shadow duration-300 hover:shadow-xl focus:ring-2 focus:outline-none",
      )}
    >
      <CardHeader className="relative">
        {product.tag && (
          <p className="bg-red text-light absolute -bottom-2 left-8 z-[1] flex w-fit items-center gap-1.5 rounded px-3 py-1 text-sm font-medium capitalize shadow">
            <Tag size={16} /> {product.tag}
          </p>
        )}

        <div className="relative h-48 w-full">
          <Image
            src={imgSrc}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={handleImgError}
            className="aspect-square rounded-t-md object-cover transition-transform duration-300 group-hover:scale-105"
            priority={false}
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-grow flex-col justify-between pt-0">
        <h3 className="mb-2 line-clamp-1 text-center">
          <span className="font-grotesk text-xl font-semibold capitalize">
            {product.title}
          </span>{" "}
          -{" "}
          <span className="text-lg font-medium capitalize">
            {product.titleBengali}
          </span>
        </h3>

        {product.packageDuration ? (
          <p className="mb-1 line-clamp-2 text-center capitalize">
            {product.packageDuration}
          </p>
        ) : (
          <span className="text-muted-foreground mb-1 block text-center text-xs">
            &nbsp;
          </span>
        )}

        <QuantityPrice
          originalPrice={product.regularPrice}
          salePrice={product.salePrice}
          className="font-grotesk mb-3 text-center text-lg"
        />

        {/* Controls (stop propagation so Card doesn't navigate) */}
        <div
          className="mt-auto"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="mb-3 flex items-center justify-center gap-4">
            <QuantityInput />
            <Separator orientation="vertical" className="h-8" />
            <MyButton onClick={handleBuyNow} className="min-w-28">
              অর্ডার করুন
            </MyButton>
          </div>
        </div>
      </CardContent>

      <CardFooter
        onClick={(e) => e.stopPropagation()}
        className="justify-center pt-0"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToDetails();
          }}
          className="text-accent-main text-sm underline underline-offset-4 hover:opacity-80"
        >
          বিস্তারিত দেখুন
        </button>
      </CardFooter>
    </Card>
  );
}
