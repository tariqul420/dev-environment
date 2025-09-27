"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import clsx from "clsx";
import { Check, ChevronsUpDown, X } from "lucide-react";

export type MultiOption = { label: string; value: string };

type Props = {
  name: string; // RHF field name, expects string[]
  label?: string;
  options: MultiOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  renderCreate?: React.ReactNode;
  summaryFormatter?: (
    selected: string[],
    all: MultiOption[],
  ) => React.ReactNode;
  listMaxHeight?: number;
  showChips?: boolean;

  // === New (Other support) ===
  enableOther?: boolean; // turn on/off extra input; default true if "Other" exists in options
  otherOptionValue?: string; // which option triggers the input
  otherFieldName?: string; // RHF text field name (default: `${name}Other`)
  otherLabel?: string; // input label
  otherPlaceholder?: string; // input placeholder
  clearOtherOnDeselect?: boolean; // clear text when 'Other' unselected (default true)
};

export default function MultiSelectField({
  name,
  label,
  options,
  placeholder = "Select options",
  disabled = false,
  className,
  renderCreate,
  summaryFormatter,
  listMaxHeight = 260,
  showChips = true,

  // Other defaults
  enableOther,
  otherOptionValue = "Other",
  otherFieldName,
  otherLabel = "Please specify",
  otherPlaceholder = "Type here…",
  clearOtherOnDeselect = true,
}: Props) {
  const { control, setValue, getValues } = useFormContext();
  const [open, setOpen] = React.useState(false);

  // Auto-enable if "Other" option exists
  const otherEnabled =
    enableOther ?? options.some((o) => o.value === otherOptionValue);
  const computedOtherField = otherFieldName ?? `${name}Other`;

  return (
    <FormField
      control={control}
      name={name as any}
      render={({ field }) => {
        const value: string[] = Array.isArray(field.value) ? field.value : [];

        const toggle = (v: string) => {
          const set = new Set(value);
          if (set.has(v)) {
            set.delete(v);
            // If unselecting "Other", optionally clear the extra input
            if (
              otherEnabled &&
              v === otherOptionValue &&
              clearOtherOnDeselect
            ) {
              setValue(computedOtherField as any, "");
            }
          } else {
            set.add(v);
          }
          field.onChange(Array.from(set));
        };

        const clearAll = () => {
          field.onChange([]);
          if (otherEnabled && clearOtherOnDeselect) {
            setValue(computedOtherField as any, "");
          }
        };

        const selectAll = () => field.onChange(options.map((o) => o.value));

        const defaultSummary = () => {
          if (!value.length)
            return <span className="text-muted-foreground">{placeholder}</span>;

          const labels = value
            .map((v) => options.find((o) => o.value === v)?.label || v)
            .filter(Boolean);

          if (!showChips) {
            return (
              <span>
                {labels.length > 2
                  ? `${labels.length} selected`
                  : labels.join(", ")}
              </span>
            );
          }
          return (
            <div className="flex flex-wrap gap-1">
              {labels.slice(0, 3).map((lab) => (
                <Badge
                  key={lab}
                  variant="secondary"
                  className="max-w-[140px] truncate"
                >
                  {lab}
                </Badge>
              ))}
              {labels.length > 3 && (
                <Badge variant="outline">+{labels.length - 3}</Badge>
              )}
            </div>
          );
        };

        const showOtherInput = otherEnabled && value.includes(otherOptionValue);

        return (
          <FormItem className={clsx("space-y-2", className)}>
            {label && <FormLabel>{label}</FormLabel>}

            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                  >
                    {summaryFormatter
                      ? summaryFormatter(value, options)
                      : defaultSummary()}
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                {/* width matches trigger */}
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  {renderCreate ? (
                    <div className="border-b p-2">{renderCreate}</div>
                  ) : null}

                  <Command>
                    {/* Search + Actions */}
                    <div className="flex items-center gap-2 px-2 pt-2">
                      <CommandInput placeholder="Search..." />
                      <div className="ml-auto flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={selectAll}
                          disabled={
                            options.length === value.length || !options.length
                          }
                        >
                          Select all
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearAll}
                          disabled={value.length === 0}
                        >
                          <X className="mr-1 h-4 w-4" /> Clear
                        </Button>
                      </div>
                    </div>

                    <CommandList>
                      <CommandEmpty>No option found.</CommandEmpty>
                      <ScrollArea style={{ maxHeight: listMaxHeight }}>
                        <CommandGroup>
                          {options.map((opt) => {
                            const checked = value.includes(opt.value);
                            return (
                              <CommandItem
                                key={opt.value}
                                value={opt.label}
                                className="cursor-pointer"
                                onSelect={() => toggle(opt.value)}
                              >
                                <Checkbox checked={checked} className="mr-2" />
                                <span className="flex-1">{opt.label}</span>
                                {checked && <Check className="h-4 w-4" />}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </ScrollArea>
                    </CommandList>
                  </Command>

                  {/* 👉 move Other input OUTSIDE <Command> */}
                  {showOtherInput && (
                    <div className="border-t p-3">
                      <FormField
                        control={control}
                        name={computedOtherField as any}
                        render={({ field: otherField }) => (
                          <div className="space-y-2">
                            <FormLabel className="text-xs">
                              {otherLabel}
                            </FormLabel>
                            <Input
                              placeholder={otherPlaceholder}
                              value={otherField.value ?? ""}
                              onChange={otherField.onChange}
                              // extra safety: stop bubbling to popover shortcuts
                              onKeyDown={(e) => e.stopPropagation()}
                              onKeyDownCapture={(e) => e.stopPropagation()}
                            />
                            <FormMessage />
                          </div>
                        )}
                      />
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </FormControl>

            {/* If you prefer the Other input below the trigger instead of inside popover, 
                move the FormField block here and remove the one above */}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
