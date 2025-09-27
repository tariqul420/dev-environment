"use client";

import { Minus, Plus, Tag, Heart, Star, Eye, Flame } from "lucide-react";
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
      className={cn(
        "group relative flex h-full cursor-pointer flex-col overflow-hidden",
        "transition-all duration-300 hover:shadow-md",
        outOrZero ? "opacity-60" : ""
      )}
      aria-disabled={outOrZero}
    >
      {/* Wishlist Button */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="secondary"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
        >
          <Heart className={cn("h-4 w-4", isWishlisted ? "fill-destructive text-destructive" : "")} />
        </Button>
      </div>

      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {discountPercentage > 0 && (
          <Badge variant="destructive" className="text-xs font-medium">
            {discountPercentage}% OFF
          </Badge>
        )}
        
        {product.tag && (
          <Badge variant="secondary" className="text-xs">
            {product.tag}
          </Badge>
        )}

        {outOrZero && (
          <Badge variant="outline" className="text-xs">
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

      <CardContent className="flex flex-grow flex-col justify-between p-4 pt-4">
        {/* Rating & Reviews */}
        <div className="flex items-center justify-center gap-1 mb-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={`star-${product.id}-${i}`}
                className={cn(
                  "h-3 w-3",
                  i < Math.floor(rating) 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">
            ({reviewCount})
          </span>
        </div>

        {/* Product Title */}
        <h3 className="mb-2 line-clamp-2 text-center font-semibold text-gray-900 dark:text-gray-100 leading-tight">
          {product.title}
        </h3>

        {/* Package Duration */}
        {product.packageDuration && (
          <div className="mb-3 flex justify-center">
            <Badge variant="outline" className="text-xs px-2 py-1">
              {product.packageDuration}
            </Badge>
          </div>
        )}

        {/* Pricing */}
        <div className="mb-4 text-center">
          {origUnit ? (
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  ৳{(unit * effectiveQty).toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ৳{(origUnit * effectiveQty).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                Save ৳{((origUnit - unit) * effectiveQty).toLocaleString()}
              </div>
            </div>
          ) : (
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              ৳{(unit * effectiveQty).toLocaleString()}
            </span>
          )}
        </div>

        {/* Quantity Controls */}
        <fieldset
          className="mx-auto mb-3 flex items-center gap-3"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") e.stopPropagation();
          }}
          aria-labelledby="quantity-controls-label"
        >
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full border-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => dispatch(decrementQty({ id: product.id }))}
            disabled={outOrZero || qty <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-3 w-3" />
          </Button>

          <div className="flex flex-col items-center">
            <span
              id="quantity-controls-label"
              className="w-8 text-center text-sm font-bold"
              aria-live="polite"
              aria-atomic="true"
            >
              {effectiveQty}
            </span>
            <span className="text-xs text-muted-foreground">
              Max {computedMax}
            </span>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full border-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() =>
              dispatch(incrementQty({ id: product.id, max: computedMax }))
            }
            disabled={outOrZero || qty >= computedMax}
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </fieldset>

        {/* Stock Indicator */}
        <div className="text-center mb-2">
          {computedMax > 0 && computedMax <= 5 && (
            <Badge variant="destructive" className="text-xs">
              Only {computedMax} left!
            </Badge>
          )}
          {computedMax > 5 && computedMax <= 20 && (
            <Badge variant="secondary" className="text-xs">
              {computedMax} in stock
            </Badge>
          )}
          {computedMax > 20 && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
              In Stock
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter
        onClick={(e) => e.stopPropagation()}
        className="flex w-full justify-between gap-3 p-4 pt-0"
      >
        <BuyNowBtn
          isCard
          product={{ ...product, images: product.images ?? [] }}
          className="flex-1 rounded-xl font-semibold text-sm py-2.5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          isOut={outOrZero}
        />
        <AddToCartButton
          isCard
          product={{ ...product, images: product.images ?? [] }}
          isOut={outOrZero}
          className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        />
      </CardFooter>

      {/* Loading shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100" />
    </Card>
  );
}
