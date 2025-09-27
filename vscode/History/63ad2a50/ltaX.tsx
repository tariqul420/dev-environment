'use client';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import * as React from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

type BaseProps = {
  label?: React.ReactNode;
  placeholder?: string;
  description?: React.ReactNode;

  className?: string;
  wrapperClassName?: string;
  textareaClassName?: string;

  rows?: number;
  minHeight?: string;
  maxLength?: number;
  showCount?: boolean;

  disabled?: boolean;
  required?: boolean;

  autoResize?: boolean;
  trimOnBlur?: boolean;

  value?: string;
  onValueChange?: (value: string) => void;
};

export type TextareaFieldProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = BaseProps & {
  name: TName;
};

export default function TextareaField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  name,
  label,
  placeholder,
  description,
  className,
  wrapperClassName,
  textareaClassName,
  rows = 4,
  minHeight,
  maxLength,
  showCount = false,
  disabled = false,
  required = false,
  autoResize = false,
  trimOnBlur = false,
  value: externalValue,
  onValueChange,
}: TextareaFieldProps<TFieldValues, TName>) {
  const taRef = React.useRef<HTMLTextAreaElement | null>(null);

  const resizeNow = React.useCallback(
    (el: HTMLTextAreaElement | null) => {
      if (!autoResize || !el) return;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    },
    [autoResize],
  );

  return (
    <FormField
      name={name}
      render={({ field }) => {
        const value = externalValue ?? field.value ?? '';

        React.useEffect(() => {
          resizeNow(taRef.current);
        }, [value, resizeNow]);

        const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
          const next = e.target.value;
          field.onChange(next);
          onValueChange?.(next);
          resizeNow(e.currentTarget);
        };

        const handleBlur: React.FocusEventHandler<HTMLTextAreaElement> = (e) => {
          if (trimOnBlur) {
            const trimmed = e.target.value.trim();
            if (trimmed !== e.target.value) {
              field.onChange(trimmed);
              onValueChange?.(trimmed);
            }
          }
          field.onBlur();
        };

        const count = typeof value === 'string' ? value.length : 0;

        return (
          <FormItem className={className}>
            {label ? (
              <FormLabel>
                {label}
                {required && <span className="ml-0.5 text-destructive">*</span>}
              </FormLabel>
            ) : null}

            <FormControl>
              <div className={cn('bg-light dark:bg-transparent overflow-hidden rounded-md', wrapperClassName)}>
                <Textarea
                  ref={taRef}
                  placeholder={placeholder}
                  value={value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={disabled || field.disabled}
                  rows={rows}
                  maxLength={maxLength}
                  className={cn('w-full', minHeight, textareaClassName)}
                  aria-required={required || undefined}
                />
              </div>
            </FormControl>

            {description ? <FormDescription>{description}</FormDescription> : null}

            {showCount && (
              <div className={cn('mt-1 text-right text-xs', maxLength && count >= maxLength * 0.95 ? 'text-destructive' : 'text-muted-foreground')}>
                {count}
                {maxLength ? ` / ${maxLength}` : ''}
              </div>
            )}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
