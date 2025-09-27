"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export default function ToasterProvider() {
  const { theme } = useTheme();

  return (
    <Toaster theme={theme === "dark" ? "light" : "dark"} position="top-right" />
  );
}
