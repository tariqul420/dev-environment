"use client";

import { Minus, Plus, Heart, Star } from "lucide-react";
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

      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={product.images?.[0]?.url ?? "/placeholder.png"}
            alt={product.images?.[0]?.alt || product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {outOrZero && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-muted-foreground font-medium text-sm">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col space-y-3 p-4">
        {/* Product Title */}
        <h3 className="line-clamp-2 text-sm font-medium leading-tight">
          {product.title}
        </h3>

        {/* Package Duration */}
        {product.packageDuration && (
          <Badge variant="outline" className="text-xs w-fit">
            {product.packageDuration}
          </Badge>
        )}

        {/* Rating & Reviews */}
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={`star-${product.id}-${i}`}
                className={cn(
                  "h-3 w-3",
                  i < Math.floor(rating) 
                    ? "fill-primary text-primary" 
                    : "fill-muted text-muted"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({reviewCount})
          </span>
        </div>

        {/* Pricing */}
        <div className="space-y-1">
          {origUnit ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">
                  ৳{(unit * effectiveQty).toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ৳{(origUnit * effectiveQty).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Save ৳{((origUnit - unit) * effectiveQty).toLocaleString()}
              </p>
            </>
          ) : (
            <span className="text-lg font-semibold">
              ৳{(unit * effectiveQty).toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock Indicator */}
        {computedMax > 0 && computedMax <= 5 && (
          <Badge variant="destructive" className="text-xs w-fit">
            Only {computedMax} left!
          </Badge>
        )}
        {computedMax > 5 && computedMax <= 20 && (
          <Badge variant="secondary" className="text-xs w-fit">
            In Stock ({computedMax})
          </Badge>
        )}

        {/* Quantity Controls */}
        <fieldset
          className="flex items-center justify-between"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") e.stopPropagation();
          }}
          aria-labelledby="quantity-controls-label"
        >
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => dispatch(decrementQty({ id: product.id }))}
              disabled={outOrZero || qty <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>

            <span
              id="quantity-controls-label"
              className="text-sm font-medium min-w-[1.5rem] text-center"
              aria-live="polite"
            >
              {effectiveQty}
            </span>

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() =>
                dispatch(incrementQty({ id: product.id, max: computedMax }))
              }
              disabled={outOrZero || qty >= computedMax}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <span className="text-xs text-muted-foreground">
            Max {computedMax}
          </span>
        </fieldset>
      </CardContent>

      <CardFooter
        onClick={(e) => e.stopPropagation()}
        className="flex gap-2 p-4 pt-0"
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
