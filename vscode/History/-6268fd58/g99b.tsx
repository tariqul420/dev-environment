import { selectProductQty } from "@/lib/features/global/global-slice";
import { event } from "@/lib/gtag";
import { useAppSelector } from "@/lib/hooks";
import { fbq } from "@/lib/meta-pixel";
import { useEffect } from "react";

export default function InitialCheckoutTracking({ slug }: { slug: string}) {
   const qty = useAppSelector((s) => selectProductQty(s, slug));

    useEffect(() => {
    // GA
        event({
          action: "buy_now",
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

    fbq("track", "InitiateCheckout", {
        content_name: slug,
        value: qty,
        content_type: "product",
      })

    // TikTok
    if (typeof window !== "undefined" && typeof window.ttq === "object") {
      window.ttq.track("ClickButton", {
        event_name: "BuyNowClicked",
        content_name: slug,
        quantity: qty,
      });
    }
  }, [qty, slug]);

  return null
}
