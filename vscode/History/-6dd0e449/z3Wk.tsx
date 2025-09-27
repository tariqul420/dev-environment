"use client";

import { OrderRecord } from "@/types/table-columns";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

export default function OrderRealtimeListener({
  onNewOrder,
  onOrderUpdated,
}: {
  onNewOrder: (order: OrderRecord) => void;
  onOrderUpdated: (order: OrderRecord) => void;
}) {
  useEffect(() => {
    const socket: Socket = io({ path: "/api/socketio" });

    socket.on("connect", () => {
      logger.info("Connected to socket");
    });

    socket.on("new-order", (order: OrderRecord) => {
      onNewOrder(order);
    });

    socket.on("order-updated", (updatedOrder: OrderRecord) => {
      onOrderUpdated(updatedOrder);
    });

    return () => {
      socket.disconnect();
    };
  }, [onNewOrder, onOrderUpdated]);

  return null;
}
