"use client"

import { event } from "@/lib/gtag";
import { fbq } from "@/lib/meta-pixel";
import { useEffect } from "react";

export default function InitialCheckoutTracking({ slug, qty }: { slug: string, qty: number}) {
    const eventId = `initchk_${id}_${Date.now()}`;

    useEffect(() => {
    // GA
        event({
          action: "begin_checkout",
          category: "ecommerce",
          label: slug,
          value: qty,
        });

        // FB Pixel
    // if (typeof window !== "undefined" && typeof window.fbq === "function") {
    //   window.fbq("trackCustom", "BuyNowClicked", {
    //     content_name: slug,
    //     value: qty,
    //     content_type: "product",
    //   });
    // }

    // fbq("track", "InitiateCheckout", {
    //     content_name: slug,
    //     value: qty,
    //     content_type: "product",
    //   })

      fbq("track", "InitiateCheckout", {
        content_id: id,
        content_type: "product",
        value: totalPrice,
        num_items: qty,
        currency: "BDT",
        item_price: 
        event_id: eventId,
      })

    // TikTok
    if (typeof window !== "undefined" && typeof window.ttq === "object") {
      window.ttq.track("InitiateCheckout", {
        event_name: "InitiateCheckout",
        content_name: slug,
        quantity: qty,
      });
    }
  }, [qty, slug]);

  return null
}
