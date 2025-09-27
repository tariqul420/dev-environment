"use client";

import { Button } from "@/components/ui/button";
import { selectProductQty } from "@/lib/features/global/global-slice";
import { event } from "@/lib/gtag";
import { useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function BuyNowBtn({ slug, className }: { slug: string, className?:string }) {

  return (
    <Button
      asChild
      className={cn("bg-accent-main text-light hover:bg-accent-hover", className)}
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
