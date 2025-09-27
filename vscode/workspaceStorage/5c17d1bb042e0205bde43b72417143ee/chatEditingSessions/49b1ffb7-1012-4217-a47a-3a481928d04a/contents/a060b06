"use client";

import { Minus, Plus, Tag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import {
  decrementQty,
  incrementQty,
  selectProductQty,
  setProductQuantity,
} from "@/lib/redux/features/global/global-slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import AddToCartButton from "./add-to-cart-button";
import BuyNowBtn from "./buy-now-btn";

type ProductCardProps = {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number | null;
  images?: { url: string; alt?: string }[];
  tag?: string | null;
  packageDuration?: string | null;
  inStock: boolean;
  stock: number;
};

export default function ProductCard({
  product,
}: {
  product: ProductCardProps;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const qty = useAppSelector((s) => selectProductQty(s, product.id));

  const computedMax = useMemo(() => {
    const stockNum = Number.isFinite(product.stock) ? product.stock : 0;
    return Math.max(0, Math.min(99, stockNum));
  }, [product.stock]);

  useEffect(() => {
    if (!product.inStock || computedMax === 0) {
      if (qty !== 0) dispatch(setProductQuantity({ id: product.id, qty: 0 }));
      return;
    }

    if (qty < 1) {
      dispatch(setProductQuantity({ id: product.id, qty: 1 }));
    } else if (qty > computedMax) {
      dispatch(setProductQuantity({ id: product.id, qty: computedMax }));
    }
  }, [computedMax, product.inStock, qty, product.id, dispatch]);

  const goToDetails = () => router.push(`/products/${product.id}`);

  const effectiveQty = Math.max(0, qty);
  const unit = product.price;
  const origUnit =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice
      : undefined;

  const sale = unit * effectiveQty;
  const orig = (origUnit ?? unit) * effectiveQty;

  const outOrZero = !product.inStock || computedMax === 0;

  const hasDiscount =
    product.compareAtPrice != null &&
    product.compareAtPrice > 0 &&
    product.compareAtPrice > product.price;

  const discountPercent =
    hasDiscount && product.compareAtPrice
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100,
        )
      : undefined;

  return (
    <Card
      tabIndex={0}
      onClick={goToDetails}
      className={`group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl transition-shadow duration-300 hover:shadow-xl pt-0 ${
        outOrZero ? "opacity-70 grayscale-[20%]" : ""
      }`}
      aria-disabled={outOrZero}
    >
      <CardHeader className="relative rounded-md p-0">
        {product.tag && outOrZero && (
          <p className="absolute -bottom-2 left-2 z-[2] flex w-fit items-center gap-1.5 rounded-sm bg-destructive px-3 py-1 text-sm font-medium capitalize text-white shadow">
            <Tag size={16} /> {product.tag}
          </p>
        )}

        {discountPercent && (
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold text-accent-foreground shadow sm:px-3 sm:py-1 sm:text-xs w-fit">
            -{discountPercent}%
          </span>
        )}

        {outOrZero && (
          <span className="absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 rounded-md bg-black/80 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white">
            Out of stock
          </span>
        )}

        <div className="relative h-48 w-full">
          <Image
            src={product.images?.[0]?.url ?? "/placeholder.png"}
            alt={product.images?.[0]?.alt || product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {outOrZero && (
            <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] transition-transform duration-300 group-hover:scale-105" />
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-grow flex-col justify-between pt-0">
        <h3 className="mb-1 line-clamp-1 text-center font-medium">
          {product.title}
        </h3>

        {product.packageDuration && (
          <p className="mb-1 line-clamp-2 text-center text-sm capitalize text-muted-foreground">
            {product.packageDuration}
          </p>
        )}

        <p className="font-grotesk mb-3 text-center text-lg">
          {origUnit ? (
            <>
              <span className="text-sm line-through">{orig} ৳</span>{" "}
              <span className="text-accent-main text-base font-semibold">
                {sale} ৳
              </span>
            </>
          ) : (
            <span className="text-base font-semibold">{sale} ৳</span>
          )}
        </p>

        <fieldset
          className="mx-auto mb-2 flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") e.stopPropagation();
          }}
          aria-labelledby="quantity-controls-label"
        >
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => dispatch(decrementQty({ id: product.id }))}
            disabled={outOrZero || qty <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <span
            id="quantity-controls-label"
            className="w-10 text-center text-sm font-medium"
            aria-live="polite"
            aria-atomic="true"
            title={`Max ${computedMax}`}
          >
            {effectiveQty}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() =>
              dispatch(incrementQty({ id: product.id, max: computedMax }))
            }
            disabled={outOrZero || qty >= computedMax}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </fieldset>
      </CardContent>

      <CardFooter
        onClick={(e) => e.stopPropagation()}
        className="flex w-full justify-between gap-2 overflow-hidden rounded-b-xl"
      >
        <BuyNowBtn
          isCard
          product={{ ...product, images: product.images ?? [] }}
          className="flex-1"
          isOut={outOrZero}
        />
        <AddToCartButton
          isCard
          product={{ ...product, images: product.images ?? [] }}
          isOut={outOrZero}
        />
      </CardFooter>
    </Card>
  );
}
