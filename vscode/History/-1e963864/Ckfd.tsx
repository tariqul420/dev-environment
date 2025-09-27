"use client";

import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";

export default function BuyNowBtn({ slug }: { slug: string }) {
  const productQuantity = useAppSelector(
    (state) => state.globals.productQuantity,
  );

  const handleClick = () => {
    gtag.event({
      action: "buy_now",
      category: "ecommerce",
      label: slug,
      value: productQuantity,
    });
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
