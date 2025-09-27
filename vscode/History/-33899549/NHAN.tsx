"use client";

import { useEffect, useRef } from "react";
import { fbq, gaEvent, ttqTrack } from "@/lib/analytics";

export default function PurchaseTracking({
  product,
}: {
  id: string;
  totalPrice: number;
  price: number;
  slug: string;
  qty: number;
}) {
  const eventId = `purchase_${id}_${Date.now()}`;
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    // Google Analytics
    gaEvent("purchase", {
      category: "ecommerce",
      label: slug,
      value: totalPrice,
      currency: "BDT",
      transaction_id: id,
      items: [
        {
          item_id: id,
          item_name: slug,
          price,
          quantity: qty,
        },
      ],
    });

    // Facebook Pixel
    fbq("track", "Purchase", {
      content_id: id,
      content_name: slug,
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
