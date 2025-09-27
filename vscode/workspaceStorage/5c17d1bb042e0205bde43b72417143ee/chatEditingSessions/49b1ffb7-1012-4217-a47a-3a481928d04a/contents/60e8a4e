"use client";

import { Minus, Plus, Tag, Heart, Star, ShoppingCart, Eye, Flame } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  // Calculate discount percentage
  const discountPercentage = origUnit 
    ? Math.round(((origUnit - unit) / origUnit) * 100)
    : 0;

  // Mock rating (can be replaced with actual rating data)
  const rating = 4.5;
  const reviewCount = 127;

  return (
    <Card
      tabIndex={0}
      onClick={goToDetails}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex h-full cursor-pointer flex-col overflow-hidden",
        "rounded-2xl border-0 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-800/80",
        "shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2",
        "backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50",
        outOrZero ? "opacity-70 grayscale-[20%]" : ""
      )}
      aria-disabled={outOrZero}
    >
      {/* Floating Action Buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-800"
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
        >
          <Heart className={cn("h-4 w-4", isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600")} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-800"
          onClick={(e) => {
            e.stopPropagation();
            // Quick view functionality
          }}
        >
          <Eye className="h-4 w-4 text-gray-600" />
        </Button>
      </div>

      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {discountPercentage > 0 && (
          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-lg">
            <Flame className="h-3 w-3 mr-1" />
            {discountPercentage}% OFF
          </Badge>
        )}
        
        {product.tag && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Tag className="h-3 w-3 mr-1" />
            {product.tag}
          </Badge>
        )}

        {outOrZero && (
          <Badge variant="destructive" className="bg-gray-800/90 text-white">
            Out of Stock
          </Badge>
        )}
      </div>

      <CardHeader className="relative p-0">
        <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
          <Image
            src={product.images?.[0]?.url ?? "/placeholder.png"}
            alt={product.images?.[0]?.alt || product.title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {outOrZero && (
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-white font-bold text-lg tracking-wide">
                OUT OF STOCK
              </span>
            </div>
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
