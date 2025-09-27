"use client";

import LanguageToggleBtn from "@/components/global/language-toggle-btn";
import { Separator } from "@/components/ui/separator";
import { returnPolicyContent } from "@/constant/data";
import { useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils/utils";

export default function ReturnsPolicyClient() {
  const language = useAppSelector((state) => state.globals.language);
  const content = returnPolicyContent[language];

  return (
    <div
      className={cn(
        "container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8",
        language === "bn" ? "font-bengali" : "font-grotesk",
      )}
    >
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{content.title}</h1>
          <p className="text-muted-foreground mt-2">{content.lastUpdated}</p>
        </div>
        <LanguageToggleBtn className="mb-0" />
      </div>

      <Separator className="mb-10" />

      <div className="space-y-10">
        {Object.entries(content.sections).map(([key, section], index) => (
          <div key={key} className="space-y-4">
            <h2 className="text-2xl font-semibold">{section.title}</h2>
            <p className="leading-relaxed">{section.content}</p>
            {index < Object.keys(content.sections).length - 1 && (
              <Separator className="my-6" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
