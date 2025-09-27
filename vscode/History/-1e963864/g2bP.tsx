"use client";

import { Button } from "@/components/ui/button";
import { selectProductQty } from "@/lib/features/global/global-slice";
import { event } from "@/lib/gtag";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";

export default function BuyNowBtn({ slug }: { slug: string }) {
  const qty = useAppSelector((s) => selectProductQty(s, slug));

  const handleClick = () => {
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
  };

  return (
    <Button
      asChild
      className="bg-accent-main text-light hover:bg-accent-hover"
      onClickCapture={(e) => e.stopPropagation()}
    >
      <Link
        href={`/checkout?slug=${slug}&quantity=${qty}`}
        onClick={handleClick}
        prefetch={false}
      >
        অর্ডার করুন
      </Link>
    </Button>
  );
}
