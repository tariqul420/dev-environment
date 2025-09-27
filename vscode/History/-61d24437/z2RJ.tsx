"use client";

import { useEffect, useRef } from "react";
import { fbq, gaEvent, ttqTrack } from "@/lib/analytics";

export default function InitialCheckoutTracking({
  id,
  slug,
  totalPrice,
  price,
  qty,
}: {
  id: string;
  totalPrice: number;
  price: number;
  slug: string;
  qty: number;
}) {
  const eventId = `initchk_${id}_${Date.now()}`;
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    // Google Analytics
    gaEvent("begin_checkout", {
      category: "ecommerce",
      label: slug,
      value: totalPrice,
      currency: "BDT",
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
    fbq("track", "InitiateCheckout", {
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
    ttqTrack("InitiateCheckout", {
      content_id: id,
      content_name: slug,
      quantity: qty,
      price,
      value: totalPrice,
      currency: "BDT",
      event_id: eventId,
    });
  }, [eventId, id, price, qty, slug, totalPrice]);

  return null;
}
