"use client";

import { useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function QuantityPrice({
  originalPrice,
  salePrice,
  className,
}: {
  originalPrice: number;
  salePrice: number;
  className?: string;
}) {
  const productQuantity = useAppSelector(
    (state) => state.globals.productQuantity,
  );
  const [originalPriceValue, setOriginalPriceValue] = useState(originalPrice);
  const [salePriceValue, setsalePriceValue] = useState(salePrice);

  useEffect(() => {
    setOriginalPriceValue(originalPrice * productQuantity);
    setsalePriceValue(salePrice * productQuantity);
  }, [salePrice, originalPrice, productQuantity]);

  return (
    <p className={cn("en mb-auto", className)}>
      <span className="font-base text-sm line-through">
        {originalPriceValue} ৳
      </span>{" "}
      -{" "}
      <span className="text-accent-main text-base font-semibold">
        {salePriceValue} ৳
      </span>
    </p>
  );
}
