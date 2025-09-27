"use client";

import { useEffect } from "react";
import { fbq, gaEvent, ttqTrack } from "@/lib/utils/analytics";

export default function ProductViewTracking({
  product,
}: {
  product: PublicProductType;
}) {
  useEffect(() => {
    gaEvent("view_item", {
      category: "Product",
      label: product.title,
      value: product.price,
      currency: "BDT",
      items: [
        {
          item_id: product.id,
          item_name: product.title,
          price: product.price,
          quantity: 1,
        },
      ],
    });

    // Facebook Pixel
    fbq("track", "ViewContent", {
      content_id: product.id,
      content_name: product.title,
      content_type: "product",
      value: product.price,
      currency: "BDT",
    });

    // TikTok Pixel
    ttqTrack("ViewContent", {
      content_id: product.id,
      content_name: product.title,
      content_type: "product",
      value: product.price,
      currency: "BDT",
    });
  }, [product]);

  return null;
}
