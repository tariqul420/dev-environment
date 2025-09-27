"use clint";

import { privacyPolicyContent } from "@/constant/data";
import { useAppSelector } from "../hooks";

export default function usePrivacyPolicyContent() {
  const language = useAppSelector((state) => state.globals.language);
  return privacyPolicyContent[language];
}
