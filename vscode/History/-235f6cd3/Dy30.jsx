"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StatusBadge({
  online = false,
  label = "System",
  className,
  pulse = true,
  subtle = true,
}) {
  const color = online ? "emerald" : "rose";

  return (
    <Badge
      variant="secondary"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-sm ring-1 ring-inset",
        subtle
          ? online
            ? "bg-emerald-950/70 text-emerald-300 ring-emerald-500/30"
            : "bg-rose-950/70 text-rose-300 ring-rose-500/30"
          : online
            ? "bg-emerald-600/15 text-emerald-300 ring-emerald-400/30"
            : "bg-rose-600/15 text-rose-300 ring-rose-400/30",
        "transition-colors",
        className,
      )}
      title={`${label} ${online ? "Online" : "Offline"}`}
    >
      {/* Dot + optional ping */}
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        {pulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-70",
              online ? "bg-emerald-400" : "bg-rose-400",
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex h-2.5 w-2.5 rounded-full",
            online ? "bg-emerald-400" : "bg-rose-400",
          )}
        />
      </span>

      {/* Text */}
      <span className="tracking-wide">
        {label}{" "}
        <span className="font-bold">{online ? "Online" : "Offline"}</span>
      </span>
    </Badge>
  );
}
