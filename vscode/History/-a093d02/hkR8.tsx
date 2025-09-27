"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { fbq } from "@/lib/utils/analytics";

export function MetaPixelProvider() {
  const pathname = usePathname();
  const search = useSearchParams();
  const didInit = useRef(false);

  useEffect(() => {
    didInit.current = true;
  }, []);
  useEffect(() => {
    if (!didInit.current) return;
    if (pathname) {
      fbq("track", "PageView");
    }
  }, [pathname, search]);

  return null;
}

export function TikTokPixelProvider() {
  const didInit = useRef(false);

  useEffect(() => {
    didInit.current = true;
  }, []);

  useEffect(() => {
    if (!didInit.current) return;
    if (typeof window !== "undefined" && typeof window.ttq !== "undefined") {
      window.ttq.page();
    }
  }, []);

  return null;
}
