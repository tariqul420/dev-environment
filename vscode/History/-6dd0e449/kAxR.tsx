"use client";

import logger from "@/lib/logger";
import { OrderRecord } from "@/types/table-columns";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

export default function OrderRealtimeListener({
  onNewOrder,
  onOrderUpdated,
  onOrderDeleted,
  onOrdersDeleted,
}: {
  onNewOrder: (order: OrderRecord) => void;
  onOrderUpdated: (order: OrderRecord) => void;
  onOrderDeleted: (orderId: string) => void;
  onOrdersDeleted: (orderIds: string[]) => void;
}) {
  const router = useRouter();

  useEffect(() => {
    const socket: Socket = io({ path: "/api/socketio" });

    socket.on("connect", () => {
      logger.info("Connected to socket");
    });

    socket.on("new-order", (order: OrderRecord) => {
      onNewOrder(order);
      router.refresh();
    });

    socket.on("order-updated", (updatedOrder: OrderRecord) => {
      onOrderUpdated(updatedOrder);
      router.refresh();
    });

    socket.on("order-deleted", ({ orderId }) => {
      onOrderDeleted(orderId);
      router.refresh();
    });

    socket.on("orders-deleted", ({ orderIds }) => {
      onOrdersDeleted(orderIds);
      router.refresh();
    });

    return () => {
      socket.disconnect();
    };
  }, [onNewOrder, onOrderDeleted, onOrderUpdated, onOrdersDeleted]);

  return null;
}
