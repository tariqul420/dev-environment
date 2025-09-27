"use client";

import { Construction } from "lucide-react";
import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function FuturePlaceholder({
  title = "Page unavailable",
  description = "This page is currently unavailable and may be ready in the future.",
  helpText = "Please check back later — we’re working on this feature.",
  className,
  icon,
  actions,
}: {
  title?: ReactNode;
  description?: ReactNode;
  helpText?: ReactNode;
  className?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[80vh] w-full items-center justify-center p-6",
        className,
      )}
    >
      <Card className="relative w-full max-w-lg border-dashed bg-muted/40 text-center shadow-sm">
        <CardHeader className="pt-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border bg-background/70 shadow">
            {icon ?? <Construction className="h-8 w-8 text-muted-foreground" />}
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {title}
          </CardTitle>
          <CardDescription className="mt-2 text-base leading-relaxed">
            {description}
          </CardDescription>
          {helpText && (
            <p className="mt-2 text-sm text-muted-foreground">{helpText}</p>
          )}
        </CardHeader>

        {actions && (
          <CardContent className="flex items-center justify-center pb-10">
            <div className="flex flex-wrap gap-2">{actions}</div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
