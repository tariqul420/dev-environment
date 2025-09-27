"use client";

import logger from "@/lib/logger";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

export default function OrderRealtimeListener() {
  const router = useRouter();
  useEffect(() => {
    const socket: Socket = io({ path: "/api/socketio" });

    socket.on("connect", () => {
      logger.info("Connected to socket");
    });

    socket.on("new-order", () => {
      // onNewOrder(order);
      router.refresh();
    });

    // socket.on("order-updated", (updatedOrder: OrderRecord) => {
    //   onOrderUpdated(updatedOrder);
    // });

    // socket.on("order-deleted", ({ orderId }) => {
    //   onOrderDeleted(orderId);
    // });

    // socket.on("orders-deleted", ({ orderIds }) => {
    //   onOrdersDeleted(orderIds);
    // });

    return () => {
      socket.disconnect();
    };
  }, [router]);

  return null;
}
