/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: typeof window.fbq;
  }
}

const FacebookPixel = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || window.fbq) return;

    const fbq = function (...args: unknown[]) {
      (fbq as any).callMethod
        ? (fbq as any).callMethod(...args)
        : (fbq as any).queue.push(args);
    };

    (fbq as any).queue = [];
    (fbq as any).loaded = true;
    (fbq as any).version = "2.0";

    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);

    window.fbq("init", process.env.NEXT_PUBLIC_META_PIXEL_ID);
    window.fbq("track", "PageView");
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  return null;
};

export default FacebookPixel;
