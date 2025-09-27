export const FB_PIXEL_ID: string = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
export const TIKTOK_PIXEL_ID: string =
  process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? "";
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: ((...args: unknown[]) => void) | undefined;
  }
}

declare global {
  interface Window {
    ttq?: {
      page: () => void;
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

export const fbq = (...args: unknown[]): void => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
};

export const ttqTrack = (
  event: string,
  data?: Record<string, unknown>,
): void => {
  if (typeof window !== "undefined" && typeof window.ttq === "object") {
    window.ttq.track(event, data);
  } else {
    if (process.env.NODE_ENV === "development") {
      console.error("[TikTok Pixel not loaded]", event, data);
    }
  }
};

export const gaEvent = (
  action: string,
  params?: {
    category?: string;
    label?: string;
    value?: number;
    [key: string]: unknown;
  },
): void => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: params?.category,
      event_label: params?.label,
      value: params?.value,
      ...params,
    });
  } else {
    if (process.env.NODE_ENV === "development") {
      console.error("[GA not loaded]", action, params);
    }
  }
};
