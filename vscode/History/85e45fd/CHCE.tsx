"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { selectProductQty } from "@/lib/redux/features/global/global-slice";
import { useAppSelector } from "@/lib/redux/hooks";

export default function BuyNowBtn({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const qty = useAppSelector((s) => selectProductQty(s, id));

  return (
    <Button asChild className={className}>
      <Link href={`/checkout?id=${id}&quantity=${qty}`}>অর্ডার করুন</Link>
    </Button>
  );
}
