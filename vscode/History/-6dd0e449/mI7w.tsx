"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import logger from "@/lib/logger";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

export default function OrderRealtimeListener() {
  const router = useRouter();

  useEffect(() => {
    const socket: Socket = io({ path: "/api/socketio" });

    socket.on("connect", () => {
      logger.info("Connected to socket");
    });

    socket.on("new-order", (order) => {
      // de-dupe

      // refresh your table/data
      router.refresh();

      // pretty popup
      toast.custom(
        (t) => (
          <Card
            className="flex max-w-xs cursor-pointer items-center gap-3 rounded-xl p-3 shadow-lg"
            onClick={() => toast.dismiss(t)}
          >
            <div className="relative h-12 w-12 overflow-hidden rounded-md">
              <Image
                src={order?.productImage || "/assets/icon.png"}
                alt="Product"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {order?.name || "Someone"} just ordered
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {order?.productTitle || "a product"} •{" "}
                {order?.district || "Bangladesh"}
              </p>
              <div className="mt-1">
                <Badge variant="secondary" className="text-[10px]">
                  {new Date(
                    order?.createdAt ?? Date.now(),
                  ).toLocaleTimeString()}
                </Badge>
              </div>
            </div>
          </Card>
        ),
        { duration: 6000 }, // bottom-left set in <Toaster/>
      );

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
