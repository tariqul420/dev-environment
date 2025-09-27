"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";
import logger from "@/lib/logger";

export default function OrderRealtimeListener() {
  const router = useRouter();

  useEffect(() => {
    const socket: Socket = io({ path: "/api/socketio" });

    socket.on("connect", () => {
      logger.info("Connected to socket");
    });

    socket.on("new-order", () => {
      router.refresh();
    });

    socket.on("update-order-status", () => {
      router.refresh();
    });

    socket.on("delete-order", () => {
      router.refresh();
    });

    socket.on("delete-orders", () => {
      router.refresh();
    });

    return () => {
      socket.disconnect();
    };
  }, [router]);

  return null;
}
