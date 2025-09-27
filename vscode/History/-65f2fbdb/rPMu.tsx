"use client";

import { Minus, Plus, Tag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import AddToCartButton from "./add-to-cart-button";
import BuyNowBtn from "./buy-now-btn";

export default function ProductCard({
  product,
}: {
  product: ProductCardProps;
}) {
  const router = useRouter();

  const computedMax = useMemo(() => {
    const softMax = product.max ?? 99;
    const stockCap = typeof product.inStock === "number" ? product.inStock : 0;
    return Math.max(0, Math.min(softMax, stockCap));
  }, [product.max, product.inStock]);

  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!product.inStock) {
      setQty(1);
    } else if (qty > computedMax) {
      setQty(computedMax || 1);
    }
  }, [computedMax, product.inStock, qty]);

  const goToDetails = () => router.push(`/products/${product.id}`);

  const orig = (product.compareAtPrice ?? product.price) * qty;
  const sale = product.price * qty;

  return (
    <Card
      tabIndex={0}
      onClick={goToDetails}
      className={`group flex h-full cursor-pointer flex-col transition-shadow duration-300 hover:shadow-xl rounded-xl overflow-hidden ${
        !product.inStock ? "opacity-70 grayscale-[20%]" : ""
      }`}
      aria-disabled={!product.inStock}
    >
      <CardHeader className="relative">
        {product.tag && !product.inStock && (
          <p className="absolute -bottom-2 left-8 z-[2] flex w-fit items-center gap-1.5 rounded-sm bg-destructive px-3 py-1 text-sm font-medium capitalize text-white shadow">
            <Tag size={16} /> {product.tag}
          </p>
        )}

        {!product.inStock && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[2] bg-black/80 px-4 py-2 rounded-md text-white text-sm font-semibold uppercase tracking-wide">
            Out of stock
          </span>
        )}

        <div className="relative h-48 w-full">
          <Image
            src={product.images?.[0]?.url ?? "/placeholder.png"}
            alt={product.images?.[0]?.alt || product.title}
            fill
            className="rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] transition-transform duration-300 group-hover:scale-105" />
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-grow flex-col justify-between pt-0">
        <h3 className="mb-1 line-clamp-1 text-center font-medium">
          {product.title}
        </h3>

        {product.packageDuration && (
          <p className="mb-1 line-clamp-2 text-center capitalize text-sm text-muted-foreground">
            {product.packageDuration}
          </p>
        )}

        <p className="font-grotesk mb-3 text-center text-lg">
          <span className="text-sm line-through">{orig} ৳</span>{" "}
          <span className="text-accent-main text-base font-semibold">
            {sale} ৳
          </span>
        </p>

        {/* Qty */}
        <fieldset
          className="mx-auto mb-2 flex items-center gap-2 focus:outline-none"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") e.stopPropagation();
          }}
          aria-label="Quantity controls"
          disabled={!product.inStock}
        >
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={!product.inStock || qty <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center text-sm font-medium">{qty}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => setQty((q) => Math.min(computedMax || 1, q + 1))}
            disabled={!product.inStock || qty >= (computedMax || 1)}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </fieldset>
      </CardContent>

      <CardFooter
        onClick={(e) => e.stopPropagation()}
        className="flex w-full gap-2 rounded-b-xl overflow-hidden justify-between"
      >
        <BuyNowBtn
          isCard
          product={product}
          className="flex-1"
          isOut={!product.inStock}
        />
        <AddToCartButton isCard product={product} isOut={!product.inStock} />
      </CardFooter>
    </Card>
  );
}
