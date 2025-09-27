'use client';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import * as React from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

/* Types */

type BaseProps = {
  id?: string;

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

  defaultValue?: string;
  error?: React.ReactNode;
};

export type TextareaFieldProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = BaseProps & {
  /** If provided, renders as a react-hook-form field; otherwise renders standalone */
  name?: TName;
};

/* --------------------------- Component ---------------------------- */

export default function TextareaField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  name,
  id,
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
  defaultValue,
  error,
}: TextareaFieldProps<TFieldValues, TName>) {
  const taRef = React.useRef<HTMLTextAreaElement | null>(null);
  const autoId = React.useId();
  const textareaId = id ?? autoId;

  const resizeNow = React.useCallback(
    (el: HTMLTextAreaElement | null) => {
      if (!autoResize || !el) return;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    },
    [autoResize],
  );

  /* ---------------------- Standalone branch ----------------------- */
  if (!name) {
    const [internal, setInternal] = React.useState<string>(defaultValue ?? '');
    const value = externalValue ?? internal;

    React.useEffect(() => {
      resizeNow(taRef.current);
    }, [value, resizeNow]);

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
      const next = e.target.value;
      onValueChange ? onValueChange(next) : setInternal(next);
      resizeNow(e.currentTarget);
    };

    const handleBlur: React.FocusEventHandler<HTMLTextAreaElement> = (e) => {
      if (trimOnBlur) {
        const trimmed = e.target.value.trim();
        if (trimmed !== e.target.value) {
          onValueChange ? onValueChange(trimmed) : setInternal(trimmed);
        }
      }
    };

    const count = typeof value === 'string' ? value.length : 0;

    return (
      <div className={className}>
        {label ? (
          <label htmlFor={textareaId} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
            {required && <span className="ml-0.5 text-destructive">*</span>}
          </label>
        ) : null}

        <div className={cn('bg-light dark:bg-transparent overflow-hidden rounded-md', wrapperClassName)}>
          <Textarea
            ref={taRef}
            id={textareaId}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            className={cn('w-full', minHeight, textareaClassName)}
            aria-required={required || undefined}
          />
        </div>

        {description ? <p className="text-[0.8rem] text-muted-foreground">{description}</p> : null}

        {showCount && (
          <div className={cn('mt-1 text-right text-xs', maxLength && count >= maxLength * 0.95 ? 'text-destructive' : 'text-muted-foreground')}>
            {count}
            {maxLength ? ` / ${maxLength}` : ''}
          </div>
        )}

        {error ? <p className="text-[0.8rem] font-medium text-destructive">{error}</p> : null}
      </div>
    );
  }

  /* -------------------- react-hook-form branch -------------------- */
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
              <FormLabel htmlFor={textareaId}>
                {label}
                {required && <span className="ml-0.5 text-destructive">*</span>}
              </FormLabel>
            ) : null}

            <FormControl>
              <div className={cn('bg-light dark:bg-transparent overflow-hidden rounded-md', wrapperClassName)}>
                <Textarea
                  ref={taRef}
                  id={textareaId}
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
