"use client";

import { Button } from "@/components/ui/button";
import { selectProductQty } from "@/lib/features/global/global-slice";
import { event as gaEvent } from "@/lib/gtag";
import { useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

/** Meta Pixel param টাইপ (no any) */
// type PixelItem = { id: string; quantity: number; item_price?: number };
// type PixelParams = {
//   content_ids?: string[];
//   content_name?: string;
//   content_type?: string;
//   contents?: PixelItem[];
//   num_items?: number;
//   value?: number;
//   currency?: string;
//   [key: string]: unknown; // extra fields থাকলে unknown
// };
// type PixelOptions = { eventID?: string };

type Props = { slug: string; price?: number; className?: string };

export default function BuyNowBtn({ slug, price, className }: Props) {
  const router = useRouter();
const qty = useAppSelector((s) => selectProductQty(s, slug));

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const quantity = Math.max(1, Number(qty || 1));
      const id = String(slug || "product");
      const name = String(slug || "Product");
      const currency = "BDT";
      const href = `/checkout?slug=${slug}&quantity=${quantity}`;

      // --- Google Analytics ---
      gaEvent({
        action: "buy_now",
        category: "ecommerce",
        label: name,
        value: quantity, // GA: count বোঝাতে
      });

      // --- Meta Pixel ---
      // const fbq = typeof window !== "undefined" ? window.fbq : undefined;
      // const eventID: string =
      //   typeof crypto !== "undefined" && "randomUUID" in crypto && typeof crypto.randomUUID === "function"
      //     ? crypto.randomUUID()
      //     : `${Date.now()}-${Math.random()}`;

      // if (typeof fbq === "function") {
      //   const baseParams: PixelParams = {
      //     content_ids: [id],
      //     content_name: name,
      //     content_type: "product",
      //     contents: [{ id, quantity }],
      //     num_items: quantity,
      //   };
      //   if (typeof price === "number" && Number.isFinite(price)) {
      //     baseParams.value = Number((price * quantity).toFixed(2));
      //     baseParams.currency = currency;
      //   }

      //   fbq("track", "InitiateCheckout", baseParams, { eventID } as PixelOptions);
      //   // Optional custom:
      //   // fbq("trackCustom", "BuyNowClicked", { slug: name, quantity }, { eventID } as PixelOptions);
      // }

      

      // --- TikTok Pixel (optional) ---
      const ttq = typeof window !== "undefined" ? window.ttq : undefined;
      if (ttq && typeof ttq.track === "function") {
        ttq.track("ClickButton", {
          event_name: "buy_now",
          content_id: id,
          content_ids: [id],
          content_name: name,
          contents: [{ id, quantity }],
          quantity,
          ...(typeof price === "number"
            ? { value: Number((price * quantity).toFixed(2)), currency }
            : {}),
        });
      }

      // ছোট্ট delay: beacon পাঠাতে সময়
      await new Promise((r) => setTimeout(r, 150));
      router.push(href);
    },
    [qty, slug, router, price]
  );

  return (
    <Button
      className={cn("bg-accent-main text-light hover:bg-accent-hover", className)}
      onClick={handleClick}
    >
      অর্ডার করুন
    </Button>
  );
}
