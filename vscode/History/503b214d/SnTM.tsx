"use client";

import dynamic from "next/dynamic";

const OrderReceipt = dynamic<OrderReceiptClientProps>(
  () => import("./order-receipt"),
  { ssr: false },
);

interface OrderItem {
  unitPrice: number | string;
  total: number | string;
  // Add other properties as needed
  [key: string]: any;
}

interface OrderData {
  subtotal: number | string;
  shippingTotal: number | string;
  total: number | string;
  items: OrderItem[];
}

interface OrderReceiptClientProps {
  order: OrderData;
}

export function OrderReceiptClient({ order }: OrderReceiptClientProps) {
  return (
    <OrderReceipt
      order={{
        ...order,
        subtotal: Number(order.subtotal),
        shippingTotal: Number(order.shippingTotal),
        total: Number(order.total),
        items: order.items.map((it) => ({
          ...it,
          unitPrice: Number(it.unitPrice),
          total: Number(it.total),
        })),
      }}
    />
  );
}
