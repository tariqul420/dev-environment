"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export default function ToasterProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      richColors
      theme={theme === "dark" ? "dark" : "light"}
      position="top-right"
    />
  );
}
