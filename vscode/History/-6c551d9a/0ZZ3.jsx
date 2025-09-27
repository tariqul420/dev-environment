"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ContactCard({
  icon,
  title,
  value,
  href,
  gradient = "from-blue-500 to-purple-500",
  className,
}) {
  const Wrapper = href ? Link : "div";
  const wrapperProps = href
    ? {
        href,
        target: href?.startsWith("http") ? "_blank" : undefined,
        rel: href?.startsWith("http") ? "noopener noreferrer" : undefined,
      }
    : {};

  return (
    <Wrapper
      {...(wrapperProps)}
      className={cn(
        "group block",
        "transition-transform duration-300 hover:scale-[1.02] focus-visible:scale-[1.02] outline-none",
        className
      )}
    >
      <Card className="border-muted/30 bg-card/60 backdrop-blur">
        <CardHeader>
          <div
            className={cn(
              "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-foreground",
              "bg-gradient-to-r text-white shadow-sm",
              gradient
            )}
          >
            {icon}
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
          {value ? (
            <CardDescription className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {value}
            </CardDescription>
          ) : null}
        </CardHeader>
      </Card>
    </Wrapper>
  );
}
