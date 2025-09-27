"use client";

import { setLanguage } from "@/lib/features/global/global-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { Button } from "../ui/button";

type LanguageBtnProps = {
  className?: string;
};

export default function LanguageToggleBtn({ className }: LanguageBtnProps) {
  const language = useAppSelector((state) => state.globals.language);
  const dispatch = useAppDispatch();

  const [isPending, startTransition] = useTransition();

  const toggleLanguage = (newLanguage: "en" | "bn") => {
    startTransition(() => {
      dispatch(setLanguage(newLanguage));
    });
  };

  return (
    <div className={cn("mb-6 flex justify-end", className)}>
      <div className="flex gap-2">
        <Button
          variant={language === "bn" ? "default" : "outline"}
          onClick={() => toggleLanguage("bn")}
          disabled={isPending}
          aria-label="Switch to Bangla"
          className="font-bengali px-4 py-2 text-sm font-medium"
        >
          বাংলা
        </Button>
        <Button
          variant={language === "en" ? "default" : "outline"}
          onClick={() => toggleLanguage("en")}
          disabled={isPending}
          aria-label="Switch to English"
          className="font-grotesk px-4 py-2 text-sm font-medium"
        >
          English
        </Button>
      </div>
    </div>
  );
}
