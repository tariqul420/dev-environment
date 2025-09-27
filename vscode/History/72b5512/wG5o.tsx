"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** Types */
type Option = {
  label: React.ReactNode;
  value: string | number;
  disabled?: boolean;
  selectIcon?: LucideIcon;
};

type BaseProps = {
  id?: string;
  icon?: LucideIcon;
  label?: React.ReactNode;
  options: Option[];
  placeholder?: string;
  description?: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  required?: boolean;
  allowClear?: boolean;
  clearLabel?: string;
  value?: string | number | undefined;
  onValueChange?: (value: string | number | undefined) => void;
  defaultValue?: string | number | undefined;
  valueAsNumber?: boolean;
  error?: React.ReactNode;
};

export type SelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = BaseProps & {
  name?: TName;
};

/** Helpers */
const CLEAR_TOKEN = "__CLEAR__";

function normalizeOut(
  raw: string,
  { valueAsNumber }: { valueAsNumber?: boolean },
): string | number | undefined {
  if (raw === CLEAR_TOKEN) return undefined;
  if (!valueAsNumber) return raw;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

function normalizeIn(v: string | number | undefined | null): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

export default function SelectField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  id,
  icon: Icon,
  label,
  options : [...options, selectIcon: SelectIcon],
  placeholder = "Select an option",
  description,
  className,
  triggerClassName,
  contentClassName,
  disabled = false,
  required = false,
  allowClear = false,
  clearLabel = "Clear",
  valueAsNumber = false,

  value: externalValue,
  onValueChange,
  defaultValue,
  error,
}: SelectFieldProps<TFieldValues, TName>) {
  const autoId = React.useId();
  const triggerId = id ?? autoId;

  const [internal, setInternal] = React.useState<string | number | undefined>(defaultValue);

  // Renderers
  const renderStandalone = () => {
    const current = externalValue !== undefined ? externalValue : internal;
    const selectValue = normalizeIn(current);

    const handleChange = (raw: string) => {
      const next = normalizeOut(raw, { valueAsNumber });
      if (onValueChange) onValueChange(next);
      else setInternal(next);
    };

    return (
      <div className={className}>
        {label ? (
          <Label htmlFor={triggerId} className="mb-2 gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            {label}
            {required && <span className="ml-0.5 text-destructive">*</span>}
          </Label>
        ) : null}

        <div className="overflow-hidden rounded-md dark:bg-transparent">
          <Select value={selectValue} onValueChange={handleChange} disabled={disabled}>
            <SelectTrigger id={triggerId} className={cn("w-full", triggerClassName)}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent className={contentClassName}>
              {allowClear && <SelectItem value={CLEAR_TOKEN}>{clearLabel}</SelectItem>}
              {options.map((opt) => {
                 const IconComp = opt.selectIcon;
                  return (
                    <SelectItem key={String(opt.value)} value={String(opt.value)} disabled={opt.disabled}>
                      <span className="flex items-center gap-2">
                        {IconComp && <IconComp className="h-4 w-4" />}
                        {opt.label}
                        </span>
                      </SelectItem>
                    );
                  })}
            </SelectContent>
          </Select>
        </div>

        {description ? <p className="text-[0.8rem] text-muted-foreground">{description}</p> : null}
        {error ? <p className="text-[0.8rem] font-medium text-destructive">{error}</p> : null}
      </div>
    );
  };

  const renderFormControlled = () => (
    <FormField
      name={name as TName}
      render={({ field }) => {
        const effectiveDisabled = disabled || field.disabled;
        const current =
          externalValue !== undefined
            ? externalValue
            : (field.value as string | number | undefined);
        const selectValue = normalizeIn(current);

        const handleChange = (raw: string) => {
          const next = normalizeOut(raw, { valueAsNumber });
          field.onChange(next);
          onValueChange?.(next);
        };

        return (
          <FormItem className={className}>
            {label ? (
              <FormLabel className="mb-2 gap-2" htmlFor={triggerId}>
                {Icon && <Icon className="h-4 w-4" />}
                {label}
                {required && <span className="ml-0.5 text-destructive">*</span>}
              </FormLabel>
            ) : null}

            <FormControl>
              <div className="overflow-hidden rounded-md dark:bg-transparent">
                <Select
                  value={selectValue}
                  onValueChange={handleChange}
                  disabled={effectiveDisabled}
                >
                  <SelectTrigger id={triggerId} className={cn("w-full", triggerClassName)}>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>

                  <SelectContent className={contentClassName}>
                    {allowClear && <SelectItem value={CLEAR_TOKEN}>{clearLabel}</SelectItem>}
                    {options.map((opt) => (
                      <SelectItem
                        key={String(opt.value)}
                        value={String(opt.value)}
                        disabled={opt.disabled}
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FormControl>

            {description ? <FormDescription>{description}</FormDescription> : null}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );

  const content = name ? renderFormControlled() : renderStandalone();
  return content;
}
