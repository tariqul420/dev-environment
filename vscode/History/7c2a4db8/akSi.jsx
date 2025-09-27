"use client";

import { useMemo, useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import clsx from "clsx";
import { Check, ChevronsUpDown, X } from "lucide-react";

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
}) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = Array.isArray(field.value) ? field.value : [];
        const selectedSet = useMemo(() => new Set(value), [value]);

        const toggle = (v) => {
          const next = new Set(selectedSet);
          next.has(v) ? next.delete(v) : next.add(v);
          field.onChange(Array.from(next));
        };

        const clearAll = () => field.onChange([]);
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
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  {/* Optional create form slot */}
                  {renderCreate ? (
                    <div className="border-b p-2">{renderCreate}</div>
                  ) : null}

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
                        <X className="mr-1 h-4 w-4" />
                        Clear
                      </Button>
                    </div>
                  </div>

                  <Command>
                    <ScrollArea style={{ maxHeight: listMaxHeight }}>
                      <CommandList>
                        <CommandEmpty>No option found.</CommandEmpty>
                        <CommandGroup>
                          {options.map((opt) => {
                            const checked = selectedSet.has(opt.value);
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
                      </CommandList>
                    </ScrollArea>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
