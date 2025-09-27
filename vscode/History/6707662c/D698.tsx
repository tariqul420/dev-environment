"use client";

import { useLanguageHydration } from "@/hooks/use-language-hydration";

export default function LanguageHydrationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useLanguageHydration();
  return <>{children}</>;
}
