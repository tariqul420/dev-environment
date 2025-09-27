"use client";

import { useEffect } from "react";
import ReactPixel from "react-facebook-pixel";
import { usePathname, useSearchParams } from "next/navigation";

export function MetaPixelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    ReactPixel.init(process.env.NEXT_PUBLIC_META_PIXEL_ID as string, undefined, {
      autoConfig: true,
      debug: false,
    });
    ReactPixel.pageView();
  }, []);

  useEffect(() => {
    ReactPixel.pageView();
  }, [pathname, search]);

  return <>{children}</>;
}
