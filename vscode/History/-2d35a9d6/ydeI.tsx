"use client";

import type { LucideIcon } from "lucide-react";
import InputField from "@/components/shared/form-fields/input-field";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ColorFieldProps = {
  id: string;
  icon?: LucideIcon;
  value: string; // expects a hex string like #RRGGBB
  onChange: (v: string) => void;
  label?: string;
  className?: string;
};

export function ColorField({ id, icon: Icon, value, onChange, label, className }: ColorFieldProps) {
  // Accept either a string or a native event from InputField
  const extractVal = (v: unknown): string => {
    if (typeof v === "string") return v;
    const t = (v as any)?.target?.value;
    return typeof t === "string" ? t : "";
  };

  // Let users type freely: keep only hex chars and optional leading "#"
  // Do NOT pad to 6 while typing; the color picker will always supply full #RRGGBB.
  const normalizeHex = (v: unknown) => {
    const raw = extractVal(v).trim();
    const stripped = raw
      .replace(/^#/, "")
      .replace(/[^0-9a-fA-F]/g, "")
      .slice(0, 6);
    return "#" + stripped;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={`${id}-hex`} className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </Label>

      <div className="flex items-center gap-2">
        {/* Color picker (always emits full #RRGGBB) */}
        <InputField
          id={`${id}-picker`}
          type="color"
          value={value}
          onChange={(e) => onChange(extractVal(e))}
          className="m-0"
          inputClassName="h-10 w-10 cursor-pointer rounded-md border bg-transparent p-1"
          aria-label={`${label ?? "Color"} picker`}
        />

        {/* Hex text input (accepts partial while typing) */}
        <InputField
          id={`${id}-hex`}
          type="text"
          placeholder="#000000"
          value={value}
          onChange={(e) => onChange(normalizeHex(e))}
          className="m-0 flex-1"
          inputClassName="font-mono"
          // inputProps={{
          //   spellCheck: false,
          //   autoComplete: "off",
          //   inputMode: "text",
          //   pattern: "^#?[0-9a-fA-F]{0,6}$",
          //   "aria-label": `${label ?? "Color"} hex`,
          // }}
        />
      </div>
    </div>
  );
}
