"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

export const OrderReceipt = dynamic(
  () =>
    import("@/components/root/recept/order-receipt").then(
      (m) => m.OrderReceiptButton,
    ),
  {
    ssr: false,
    loading: () => (
      <Button variant="outline" className="w-full" disabled>
        Preparing…
      </Button>
    ),
  },
);
