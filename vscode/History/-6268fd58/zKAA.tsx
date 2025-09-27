import { event } from "@/lib/gtag";
import { useEffect } from "react";

export default function InitialCheckoutTracking() {
    useEffect(() => {
    // GA
        event({
          action: "buy_now",
          category: "ecommerce",
          label: slug,
          value: qty,
        });

        // FB Pixel
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("trackCustom", "BuyNowClicked", {
        content_name: slug,
        value: qty,
        content_type: "product",
      });
    }

    // TikTok
    if (typeof window !== "undefined" && typeof window.ttq === "object") {
      window.ttq.track("ClickButton", {
        event_name: "BuyNowClicked",
        content_name: slug,
        quantity: qty,
      });
    }
  }, [value]);

  return null
}
