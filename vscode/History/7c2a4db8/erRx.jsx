"use client";

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
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function MultiSelectField({
  name,
  label,
  options,
  placeholder = "Select options",
  disabled = false,
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
          if (next.has(v)) next.delete(v);
          else next.add(v);
          field.onChange(Array.from(next));
        };

        const clearAll = () => field.onChange([]);

        return (
          <FormItem className="space-y-2">
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
                    <div className="flex flex-wrap gap-1">
                      {value.length === 0 ? (
                        <span className="text-muted-foreground">
                          {placeholder}
                        </span>
                      ) : (
                        value.map((v) => {
                          const opt = options.find((o) => o.value === v);
                          return (
                            <Badge key={v} variant="secondary" className="mr-1">
                              {opt?.label ?? v}
                            </Badge>
                          );
                        })
                      )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <div className="flex items-center justify-between px-2 pt-2">
                    <CommandInput placeholder="Search..." />
                    {value.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={clearAll}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear</span>
                      </Button>
                    )}
                  </div>
                  <Command>
                    <CommandList>
                      <CommandEmpty>No option found.</CommandEmpty>
                      <CommandGroup>
                        {options.map((opt) => {
                          const checked = selectedSet.has(opt.value);
                          return (
                            <CommandItem
                              key={opt.value}
                              value={opt.label}
                              onSelect={() => toggle(opt.value)}
                              className="cursor-pointer"
                            >
                              <Checkbox checked={checked} className="mr-2" />
                              <span className="flex-1">{opt.label}</span>
                              {checked && <Check className="h-4 w-4" />}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
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
