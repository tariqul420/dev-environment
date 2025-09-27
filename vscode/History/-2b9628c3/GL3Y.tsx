"use client";

import LanguageToggleBtn from "@/components/global/language-toggle-btn";
import { Separator } from "@/components/ui/separator";
import { privacyPolicyContent } from "@/constant/data";
import { cookies } from "next/headers";

export default function PrivacyPolicy() {
  // const language = useAppSelector((state) => state.globals.language);
  // const content = termsContent[language];

  const cookieStore = cookies();
  const lang = cookieStore.get("language")?.value || "bn";

  const content = privacyPolicyContent[lang];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
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
