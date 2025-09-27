"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { fbq } from "@/lib/meta-pixel";

export default function MetaPixelProvider() {
  const pathname = usePathname();
  const search = useSearchParams();

  // Fire on route changes
  useEffect(() => {
    if (pathname) {
      fbq("track", "PageView");
    }
  }, [pathname, search]);

  return null;
}
