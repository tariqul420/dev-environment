"use client";

import dynamic from "next/dynamic";

const OrderReceipt = dynamic(
  () => import("./order-receipt").then((mod) => mod.OrderReceipt),
  { ssr: false },
);

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
