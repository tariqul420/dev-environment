"use client";

import { useEffect, useRef } from "react";
import { fbq, gaEvent, ttqTrack } from "@/lib/utils/analytics";

interface OrderItem {
  id: string;
  title: string;
  qty: number;
  unitPrice: number;
  total: number;
}

interface OrderProduct {
  id: string;
  orderNo: string;
  total: number;
  items: OrderItem[];
}

export default function PurchaseTracking({
  product,
}: {
  product: OrderProduct;
}) {
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
      items: product.items.map(({ id, title, unitPrice, qty }: OrderItem) => ({
        item_id: id,
        item_name: title,
        price: unitPrice,
        quantity: qty,
      })),
    });

    // Facebook Pixel
    fbq("track", "Purchase", {
      content_id: product.id,
      content_name: product.orderNo,
      content_type: "product",
      value: product.total,
      num_items: product.items.length,
      currency: "BDT",
      item_price: product.items[0]?.unitPrice || 0,
      event_id: eventId,
    });

    // TikTok Pixel
    ttqTrack("CompletePayment", {
      content_id: product.id,
      content_name: product.orderNo,
      quantity: product.items.reduce(
        (sum: number, item: OrderItem) => sum + item.qty,
        0,
      ),
      price: product.items[0]?.unitPrice || 0,
      value: product.total,
      currency: "BDT",
      order_id: product.id,
      event_id: eventId,
    });
  }, [eventId, product]);

  return null;
}
