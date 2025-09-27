"use client";

import { Button } from "@/components/ui/button";
import { selectProductQty } from "@/lib/features/global/global-slice";
import { useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function BuyNowBtn({ slug, className }: { slug: string, className?:string }) {
  const qty = useAppSelector((s) => selectProductQty(s, slug));

  return (
    <Button
      asChild
      className={cn("bg-accent-main text-light hover:bg-accent-hover", className)}
      onClickCapture={(e) => e.stopPropagation()}
    >
      <Link
        href={`/checkout?slug=${slug}&quantity=${qty}`}
        prefetch={false}
      >
        অর্ডার করুন
      </Link>
    </Button>
  );
}
