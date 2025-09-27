"use client";

import { Construction, Info, Link as LinkIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/**
 * FuturePlaceholder — reusable, polished placeholder component (Shadcn-only)
 * -------------------------------------------------------------------------
 * Drop this anywhere (dashboard, root, not-found, dialogs). No motion libs.
 *
 * Props
 * - title: heading text
 * - description: short description below the title
 * - helpText: subtle helper copy below description
 * - icon: optional ReactNode icon (defaults to <Construction />)
 * - variant: "default" | "muted" | "outline"
 * - tone: "neutral" | "warning" | "success" | "info"
 * - size: "sm" | "md" | "lg"
 * - actions: ReactNode (buttons/links)
 * - children: ReactNode (slot for extra content — lists, tips, etc.)
 *
 * Example:
 * <FuturePlaceholder
 *   title="Support"
 *   description="This page is not ready yet."
 *   helpText="We’ll enable tickets and SLAs after backend wiring."
 *   actions={<Button>Go back</Button>}
 * />
 */
export function FuturePlaceholder({
  title = "Page unavailable",
  description = "This page is currently unavailable and may be ready in the future.",
  helpText = "Please check back later — we’re working on this feature.",
  className,
  icon,
  variant = "default",
  tone = "neutral",
  size = "md",
  actions,
  children,
}: {
  title?: ReactNode;
  description?: ReactNode;
  helpText?: ReactNode;
  className?: string;
  icon?: ReactNode;
  variant?: "default" | "muted" | "outline";
  tone?: "neutral" | "warning" | "success" | "info";
  size?: "sm" | "md" | "lg";
  actions?: ReactNode;
  children?: ReactNode;
}) {
  const toneClasses = {
    neutral: "from-muted/40 via-transparent",
    warning: "from-yellow-500/20 via-transparent",
    success: "from-green-500/20 via-transparent",
    info: "from-blue-500/20 via-transparent",
  }[tone];

  const sizeClasses =
    size === "sm"
      ? {
          icon: "h-6 w-6",
          title: "text-lg",
          padding: "p-4",
          contentGap: "space-y-3",
        }
      : size === "lg"
        ? {
            icon: "h-12 w-12",
            title: "text-2xl",
            padding: "p-8",
            contentGap: "space-y-5",
          }
        : {
            icon: "h-10 w-10",
            title: "text-xl",
            padding: "p-6",
            contentGap: "space-y-4",
          };

  const VariantCard = ({ children: node }: { children: ReactNode }) => (
    <Card
      className={cn(
        "relative overflow-hidden",
        variant === "muted" && "bg-muted/40",
        variant === "outline" && "border-dashed",
        className,
      )}
    >
      {/* Soft gradient accent */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r to-transparent",
          toneClasses,
        )}
      />
      {/* Subtle grid pattern */}
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
        <div className="h-full w-full opacity-[0.04] [background:linear-gradient(0deg,transparent_24px,rgba(0,0,0,.05)_25px),linear-gradient(90deg,transparent_24px,rgba(0,0,0,.05)_25px)] [background-size:25px_25px]" />
      </div>
      {node}
    </Card>
  );

  return (
    <VariantCard>
      <CardHeader className={cn("text-center", sizeClasses.padding)}>
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border bg-background/70 shadow-sm md:mb-4">
          {icon ?? (
            <Construction
              className={cn(sizeClasses.icon, "text-muted-foreground")}
            />
          )}
        </div>
        <div className="mx-auto max-w-prose">
          <CardTitle className={cn("font-semibold", sizeClasses.title)}>
            {title}
          </CardTitle>
          <CardDescription className="mt-1 leading-relaxed">
            {description}
          </CardDescription>
          {helpText && (
            <p className="mt-2 text-xs text-muted-foreground">
              {typeof helpText === "string" ? helpText : helpText}
            </p>
          )}
        </div>
      </CardHeader>

      {(actions || children) && (
        <CardContent
          className={cn("mx-auto max-w-3xl", sizeClasses.contentGap)}
        >
          {actions && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {actions}
            </div>
          )}
          {actions && children && <Separator className="my-1" />}
          {children}
        </CardContent>
      )}
    </VariantCard>
  );
}

// -----------------------------
// Convenience presets (optional)
// -----------------------------

export function FuturePlaceholderMuted(
  props: Omit<Parameters<typeof FuturePlaceholder>[0], "variant">,
) {
  return <FuturePlaceholder variant="muted" {...props} />;
}

export function FuturePlaceholderOutline(
  props: Omit<Parameters<typeof FuturePlaceholder>[0], "variant">,
) {
  return <FuturePlaceholder variant="outline" {...props} />;
}

export function FuturePlaceholderInfo(
  props: Omit<Parameters<typeof FuturePlaceholder>[0], "tone">,
) {
  return (
    <FuturePlaceholder
      tone="info"
      icon={<Info className="h-10 w-10 text-blue-500" />}
      {...props}
    />
  );
}

export function FuturePlaceholderWithLinks({
  docsHref,
  homeHref,
  ...rest
}: Omit<Parameters<typeof FuturePlaceholder>[0], "actions"> & {
  docsHref?: string;
  homeHref?: string;
}) {
  return (
    <FuturePlaceholder
      actions={
        <>
          {homeHref && (
            <Button asChild>
              <a href={homeHref}>Go to Dashboard</a>
            </Button>
          )}
          {docsHref && (
            <Button variant="outline" asChild>
              <a href={docsHref}>
                <LinkIcon className="mr-2 h-4 w-4" /> Docs
              </a>
            </Button>
          )}
        </>
      }
      {...rest}
    />
  );
}
