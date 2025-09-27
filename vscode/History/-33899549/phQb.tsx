"use client";

import { useEffect, useRef } from "react";
import { fbq, gaEvent, ttqTrack } from "@/lib/utils/analytics";

export default function PurchaseTracking({ product }: { product: any }) {
  const eventId = `purchase_${product.id}_${Date.now()}`;
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    // Google Analytics
    gaEvent("purchase", {
      category: "ecommerce",
      label: product.id,
      value: product.total,
      currency: "BDT",
      transaction_id: product.orderNo,
      items: [
        product.items.map(({ id, title, price, qty }: any) => ({
          item_id: id,
          item_name: title,
          price,
          quantity: qty,
        })),
      ],
    });

    // Facebook Pixel
    fbq("track", "Purchase", {
      content_id: product.id,
      content_name: product.orderNo,
      content_type: "product",
      value: totalPrice,
      num_items: qty,
      currency: "BDT",
      item_price: price,
      event_id: eventId,
    });

    // TikTok Pixel
    ttqTrack("CompletePayment", {
      content_id: id,
      content_name: slug,
      quantity: qty,
      price,
      value: totalPrice,
      currency: "BDT",
      order_id: id,
      event_id: eventId,
    });
  }, [eventId, id, price, qty, slug, totalPrice]);

  return null;
}
