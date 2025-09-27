"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { fbq } from "@/lib/analytics";

export default function MetaPixelProvider() {
  const pathname = usePathname();
  const search = useSearchParams();
  const didInit = useRef(false);

  useEffect(() => {
    didInit.current = true;
  }, []);
  // Fire on route changes
  useEffect(() => {
    if (!didInit.current) return;
    if (pathname) {
      fbq("track", "PageView");
    }
  }, [pathname, search]);

  return null;
}
