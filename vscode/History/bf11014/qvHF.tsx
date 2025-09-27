"use client";

import { event } from "@/lib/gtag";
import { IProduct } from "@/types/product";
import { useEffect } from "react";

export default function ProductViewTracking({
  product,
}: {
  product: IProduct;
}) {
  useEffect(() => {
    event({
      action: "view_item",
      category: "Product",
      label: product.title,
      value: product.salePrice,
    });
  }, [product]);

  return null;
}
