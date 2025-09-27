"use client";
import { useMemo } from "react";
import { selectProductQty } from "@/lib/redux/features/global/global-slice";
import { useAppSelector } from "@/lib/redux/hooks";
import { cn } from "@/lib/utils";

export default function QuantityPrice({
  compareAtPrice,
  price,
  id,
  className,
}: {
  compareAtPrice: number;
  price: number;
  id: string;
  className?: string;
}) {
  const qty = useAppSelector((s) => selectProductQty(s, id));

  const { orig, sale } = useMemo(
    () => ({
      orig: compareAtPrice * qty,
      sale: price * qty,
    }),
    [compareAtPrice, price, qty],
  );

  return (
    <p className={cn("font-grotesk mb-auto", className)}>
      <span className="text-sm line-through">{orig} ৳</span> -{" "}
      <span className="text-accent-main text-base font-semibold">{sale} ৳</span>
    </p>
  );
}
