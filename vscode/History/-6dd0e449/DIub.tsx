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
      // refresh your table/data
      router.refresh();

      // optional tiny sound
      try {
        const a = new Audio("/sounds/new-order.mp3");
        a.volume = 0.25;
        a.play().catch(() => {});
      } catch {}
    });

    return () => {
      socket.disconnect();
    };
  }, [router]);

  return null;
}
