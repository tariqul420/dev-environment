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
    // Google Analytics (gtag)
    event({
      action: "view_item",
      category: "Product",
      label: product.title,
      value: product.salePrice,
    });

    // Facebook Pixel
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "ViewContent", {
        content_name: product.title,
        content_type: "product",
        value: product.salePrice,
        currency: "BDT",
      });
    }

    // TikTok Pixel
    if (typeof window !== "undefined" && typeof window.ttq === "object") {
      window.ttq.track("ViewContent", {
        content_name: product.title,
        content_type: "product",
        value: product.salePrice,
        currency: "BDT",
      });
    }
  }, [product]);

  return null;
}
