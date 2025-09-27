// lib/fbpixel.ts

export const FB_PIXEL_ID: string = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

// Declare global fbq type once
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: ((...args: unknown[]) => void) | undefined
  }
}

// Safe wrapper; no-op if fbq not loaded yet
export const fbq = (...args: unknown[]): void => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
};
