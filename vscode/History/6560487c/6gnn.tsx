// components/analytics/MetaPixelProvider.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { fbq } from "@/lib/meta-pixel";

export default function MetaPixelProvider() {
  const pathname = usePathname();
  const search = useSearchParams();

  // Fire on route changes
  useEffect(() => {
    // Avoid initial fire here (the base snippet already did PageView)
    // But for subsequent navigations:
    if (pathname) {
      fbq("track", "PageView");
    }
  }, [pathname, search]);

  return null;
}
