"use client";
import { useMemo } from "react";
import { selectProductQty } from "@/lib/redux/features/global/global-slice";
import { useAppSelector } from "@/lib/redux/hooks";
import { cn } from "@/lib/utils";

export default function QuantityPrice({
  originalPrice,
  salePrice,
  slug,
  className,
}: {
  originalPrice: number;
  salePrice: number;
  slug: string;
  className?: string;
}) {
  const qty = useAppSelector((s) => selectProductQty(s, slug));

  const { orig, sale } = useMemo(
    () => ({
      orig: originalPrice * qty,
      sale: salePrice * qty,
    }),
    [originalPrice, salePrice, qty],
  );

  return (
    <p className={cn("font-grotesk mb-auto", className)}>
      <span className="text-sm line-through">{orig} ৳</span> -{" "}
      <span className="text-accent-main text-base font-semibold">{sale} ৳</span>
    </p>
  );
}
