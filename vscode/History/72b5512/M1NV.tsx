'use client';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import * as React from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

/* -------------------------- Types -------------------------- */

export type Option = {
  label: React.ReactNode;
  value: string | number;
  disabled?: boolean;
};

type BaseProps = {
  /** Optional id for the trigger; if omitted, an auto id is used */
  id?: string;

  label?: React.ReactNode;
  options: Option[];
  placeholder?: string;
  description?: React.ReactNode;

  className?: string; // wrapper
  triggerClassName?: string; // <SelectTrigger>
  contentClassName?: string; // <SelectContent>

  disabled?: boolean;
  required?: boolean;
  allowClear?: boolean;
  clearLabel?: string;

  /** If true, converts string values to numbers for the external value/onChange */
  valueAsNumber?: boolean;

  /** Standalone/controlled usage (when `name` is not provided) */
  value?: string | number | null | undefined;
  defaultValue?: string | number | null | undefined;
  onValueChange?: (value: string | number | undefined) => void;

  /** Optional error text for standalone mode */
  error?: React.ReactNode;
};

export type SelectFieldProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = BaseProps & {
  /**
   * If provided, the component renders as a react-hook-form field.
   * If omitted, it behaves as a standalone controlled/uncontrolled select.
   */
  name?: TName;
};

/* ----------------------- Component ------------------------- */

export default function SelectField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  // common
  name,
  id,
  label,
  options,
  placeholder = 'Select an option',
  description,
  className,
  triggerClassName,
  contentClassName,
  disabled = false,
  required = false,
  allowClear = false,
  clearLabel = 'Clear',
  valueAsNumber = false,

  // standalone props
  value,
  defaultValue,
  onValueChange,
  error,
}: SelectFieldProps<TFieldValues, TName>) {
  const autoId = React.useId();
  const selectId = id ?? autoId;

  const normalizeIn = (v: unknown): string => {
    if (v === undefined || v === null) return '';
    return String(v);
  };

  const denormalizeOut = (v: string): string | number | undefined => {
    if (v === '') return undefined;
    return valueAsNumber ? Number(v) : v;
  };

  /* ---------------- Standalone branch ---------------- */
  if (!name) {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<string>(normalizeIn(defaultValue));

    const current = isControlled ? normalizeIn(value) : internal;

    const handleChange = (v: string) => {
      const next = denormalizeOut(v);
      if (!isControlled) setInternal(normalizeIn(next));
      onValueChange?.(next);
    };

    return (
      <div className={cn(className)}>
        {label ? (
          <FormLabel htmlFor={selectId}>
            {label}
            {required && <span className="ml-0.5 text-destructive">*</span>}
          </FormLabel>
        ) : null}

        <Select value={current} onValueChange={handleChange} disabled={disabled}>
          <SelectTrigger id={selectId} className={triggerClassName ?? 'w-full'} aria-required={required || undefined}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent className={contentClassName}>
            {allowClear && <SelectItem value="">{clearLabel}</SelectItem>}
            {options.map((opt) => (
              <SelectItem key={String(opt.value)} value={String(opt.value)} disabled={opt.disabled}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {description ? <FormDescription>{description}</FormDescription> : null}
        {error ? <p className="text-[0.8rem] font-medium text-destructive">{error}</p> : null}
      </div>
    );
  }

  /* ---------------- RHF branch ---------------- */
  return (
    <FormField
      name={name}
      render={({ field }) => {
        const current = normalizeIn(field.value);

        const handleChange = (v: string) => {
          const next = denormalizeOut(v);
          field.onChange(next);
          onValueChange?.(next);
        };

        return (
          <FormItem className={className}>
            {label ? (
              <FormLabel htmlFor={selectId}>
                {label}
                {required && <span className="ml-0.5 text-destructive">*</span>}
              </FormLabel>
            ) : null}

            <FormControl>
              <Select value={current} onValueChange={handleChange} disabled={disabled || field.disabled}>
                <SelectTrigger id={selectId} className={triggerClassName ?? 'w-full'} aria-required={required || undefined}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent className={contentClassName}>
                  {allowClear && <SelectItem value="">{clearLabel}</SelectItem>}
                  {options.map((opt) => (
                    <SelectItem key={String(opt.value)} value={String(opt.value)} disabled={opt.disabled}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>

            {description ? <FormDescription>{description}</FormDescription> : null}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
