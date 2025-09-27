// app/providers.tsx
"use client";
import { useEffect } from "react";
import TiktokPixel from "react-tiktok-pixel";
import { usePathname, useSearchParams } from "next/navigation";

export function TikTokPixelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    TiktokPixel.init(process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID as string);
    TiktokPixel.pageView();
  }, []);

  useEffect(() => {
    TiktokPixel.pageView();
  }, [pathname, search]);

  return <>{children}</>;
}
