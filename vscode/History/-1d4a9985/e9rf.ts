// lib/fbpixel.ts
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq?: any;
  }
}

// Safe wrapper; no-op if missing
export const fbq = (...args: any[]) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
};
