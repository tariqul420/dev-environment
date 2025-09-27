"use client";

import { setLanguage } from "@/lib/features/global/global-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils/utils";
import { setCookie } from "cookies-next"; // ✅ install this: npm i cookies-next
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
      dispatch(setLanguage(newLanguage)); // Redux update
      setCookie("language", newLanguage, { path: "/" }); // ✅ cookie sync
    });
  };

  return (
    <div className={cn("mb-6 flex justify-end", className)}>
      <div className="flex gap-2">
        <Button
          variant={language === "bn" ? "default" : "outline"}
          onClick={() => toggleLanguage("bn")}
          disabled={isPending}
        >
          বাংলা
        </Button>
        <Button
          variant={language === "en" ? "default" : "outline"}
          onClick={() => toggleLanguage("en")}
          disabled={isPending}
        >
          English
        </Button>
      </div>
    </div>
  );
}
