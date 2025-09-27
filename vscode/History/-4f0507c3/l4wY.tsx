"use client";

import { useEffect } from "react";

export default function OfflineProvider() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const url = "/offline-sw.js";

    navigator.serviceWorker
      .register(url, { scope: "/" })
      .catch((err) => {
        console.error("SW registration failed:", err);
      });
  }, []);

  return null;
}