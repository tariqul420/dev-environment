"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function SocialLinkButton({ href, icon, label, className }) {
  return (
    <Button
      asChild
      variant="outline"
      className={cn(
        "h-12 w-12 rounded-xl p-0",
        "border-muted/30 text-muted-foreground hover:text-foreground hover:border-foreground/30",
        "transition-all hover:scale-110",
        className
      )}
      aria-label={label}
      title={label}
    >
      <Link href={href} target="_blank" rel="noopener noreferrer">
        {icon}
      </Link>
    </Button>
  );
}
