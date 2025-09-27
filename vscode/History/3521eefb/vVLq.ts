"use client";

import { privacyPolicyContent } from "@/constant/data";
import { useAppSelector } from "@/lib/hooks";

export default function usePrivacyPolicyContent() {
  const language = useAppSelector((state) => state.globals.language);
  return privacyPolicyContent[language];
}
