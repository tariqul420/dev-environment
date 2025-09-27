"use client";
import { ChildrenProps } from "@/types";
import { ClerkProvider } from "@clerk/nextjs";
import { useTheme } from "next-themes";

export default function ClientClerkProvider({ children }: ChildrenProps) {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: theme === "dark" ? "dark" : "light",
      }}
    >
      {children}
    </ClerkProvider>
  );
}
