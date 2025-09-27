"use client";

import dynamic from "next/dynamic";
import type { OrderData } from "@/types/order";

// Dynamically import OrderReceipt with SSR disabled
const OrderReceipt = dynamic(
  () =>
    import("@/components/root/checkout/order-receipt").then(
      (mod) => mod.OrderReceipt,
    ),
  { ssr: false },
);

interface OrderReceiptClientProps {
  order: OrderData;
}

export function OrderReceiptClient({ order }: OrderReceiptClientProps) {
  return <OrderReceipt order={order} />;
}
