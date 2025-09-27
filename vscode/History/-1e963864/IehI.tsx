"use client";

import { Button } from "@/components/ui/button";
import { event } from "@/lib/gtag";

import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";

export default function BuyNowBtn({ slug }: { slug: string }) {
  const productQuantity = useAppSelector(
    (state) => state.globals.productQuantity,
  );

  const handleClick = () => {
    // Google Analytics
    event({
      action: "buy_now",
      category: "ecommerce",
      label: slug,
      value: productQuantity,
    });

    // Facebook Pixel
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("trackCustom", "BuyNowClicked", {
        content_name: slug,
        value: productQuantity,
        content_type: "product",
      });
    }

    // TikTok Pixel
    if (typeof window !== "undefined" && typeof window.ttq === "object") {
      window.ttq.track("ClickButton", {
        event_name: "BuyNowClicked",
        content_name: slug,
        quantity: productQuantity,
      });
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="bg-accent-main hover:bg-accent-hover text-light cursor-pointer"
    >
      <Link href={`/checkout?slug=${slug}&quantity=${productQuantity}`}>
        Buy Now
      </Link>
    </Button>
  );
}
