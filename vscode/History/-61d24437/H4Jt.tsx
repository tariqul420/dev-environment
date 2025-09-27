"use client";

import { useEffect, useRef } from "react";
import { fbq, gaEvent, ttqTrack } from "@/lib/utils/analytics";

type TrackItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
};

type SingleProductData = {
  id: string;
  title: string;
  price: number;
  qty: number;
  total?: number;
  currency?: string;
};

type CartProductData = {
  items: TrackItem[];
  total?: number;
  currency?: string;
};

type Props = {
  mode: "direct" | "cart";
  product: SingleProductData | CartProductData;
};

// Type guard to check if product has items property (CartProductData)
function isCartProduct(
  product: SingleProductData | CartProductData,
): product is CartProductData {
  return "items" in product && Array.isArray(product.items);
}

export default function InitialCheckoutTracking({ mode, product }: Props) {
  const fired = useRef(false);

  // Normalize to a list of items + totals
  const items: TrackItem[] = isCartProduct(product)
    ? product.items
    : [
        {
          id: product.id,
          title: product.title,
          price: Number(product.price ?? 0),
          qty: Number(product.qty ?? 1),
        },
      ];

  const currency = product.currency ?? "BDT";
  const computedTotal =
    product.total ??
    items.reduce((sum, it) => sum + Number(it.price) * Number(it.qty), 0);

  const numItems = items.reduce((sum, it) => sum + Number(it.qty), 0);
  const contentIds = items.map((it) => it.id);
  const eventId = `initchk_${contentIds.join("_")}_${Date.now()}`;

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    gaEvent("begin_checkout", {
      category: "ecommerce",
      label: mode,
      value: computedTotal,
      currency,
      items: items.map((it) => ({
        item_id: it.id,
        item_name: it.title,
        price: it.price,
        quantity: it.qty,
      })),
    });

    fbq("track", "InitiateCheckout", {
      ...(items.length === 1
        ? {
            content_id: items[0].id,
            content_name: items[0].title,
            item_price: items[0].price,
          }
        : {}),
      content_ids: contentIds,
      contents: items.map((it) => ({
        id: it.id,
        quantity: it.qty,
        item_price: it.price,
      })),
      content_type: mode === "cart" ? "cart" : "product",
      num_items: numItems,
      value: computedTotal,
      currency,
      event_id: eventId,
    });

    ttqTrack("InitiateCheckout", {
      ...(items.length === 1
        ? {
            content_id: items[0].id,
            content_name: items[0].title,
            quantity: items[0].qty,
            price: items[0].price,
          }
        : {}),
      contents: items.map((it) => ({
        content_id: it.id,
        content_name: it.title,
        quantity: it.qty,
        price: it.price,
      })),
      value: computedTotal,
      currency,
      event_id: eventId,
    });
  }, [mode, computedTotal, currency, items, contentIds, numItems, eventId]);

  return null;
}
