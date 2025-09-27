"use client";

import { useEffect } from "react";
import { fbq, gaEvent, ttqTrack } from "@/lib/analytics";
import type { IProduct } from "@/types/product";

export default function ProductViewTracking({
  product,
}: {
  product: IProduct & { _id: string };
}) {
  useEffect(() => {
    gaEvent("view_item", {
      category: "Product",
      label: product.title,
      value: product.salePrice,
      currency: "BDT",
      items: [
        {
          item_id: product._id,
          item_name: product.title,
          price: product.salePrice,
          quantity: 1,
        },
      ],
    });

    // Facebook Pixel
    fbq("track", "ViewContent", {
      content_id: product._id,
      content_name: product.title,
      content_type: "product",
      value: product.salePrice,
      currency: "BDT",
    });

    // TikTok Pixel
    ttqTrack("ViewContent", {
      content_id: product._id,
      content_name: product.title,
      content_type: "product",
      value: product.salePrice,
      currency: "BDT",
    });
  }, [product]);

  return null;
}
