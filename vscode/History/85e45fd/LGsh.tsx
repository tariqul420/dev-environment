"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { selectProductQty } from "@/lib/redux/features/global/global-slice";
import { useAppSelector } from "@/lib/redux/hooks";
import { cn } from "@/lib/utils";

export default function BuyNowBtn({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const qty = useAppSelector((s) => selectProductQty(s, slug));

  return (
    <Button asChild className={className}>
      <Link href={`/checkout?slug=${slug}&quantity=${qty}`}>অর্ডার করুন</Link>
    </Button>
  );
}
