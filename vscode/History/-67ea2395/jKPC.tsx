"use client";

import { useInitialReferral } from "@/hooks/use-initial-referral";

export default function ClientWrapper() {
  useInitialReferral();
  return null;
}
