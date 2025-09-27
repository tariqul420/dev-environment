"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

export type SortOption = {
  value: string;
  label: string;
};

export interface SortSelectProps {
  items: SortOption[];
  paramKey?: string;
  placeholder?: string;
  defaultValue?: string;
  debounceMs?: number;
  replace?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
  ariaLabel?: string;
}

export default function SortSelect({
  items,
  paramKey = "sort",
  placeholder = "Default sorting",
  defaultValue = "",
  debounceMs = 350,
  replace = true,
  className = "w-full md:w-48",
  onValueChange,
  ariaLabel = "Sort options",
}: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialValue = React.useMemo(
    () => searchParams?.get(paramKey) ?? defaultValue,

    [defaultValue, paramKey, searchParams],
  );

  const [value, setValue] = React.useState(initialValue);

  // Keep state in sync when user navigates with back/forward, etc.
  React.useEffect(() => {
    const urlVal = searchParams?.get(paramKey) ?? defaultValue;
    setValue((prev) => (prev !== urlVal ? urlVal : prev));
  }, [searchParams, paramKey, defaultValue]);

  // Debounced URL update
  React.useEffect(() => {
    const t = setTimeout(() => {
      if (!searchParams) return;

      const newUrl =
        value && value !== defaultValue
          ? formUrlQuery({
              params: searchParams.toString(),
              key: paramKey,
              value,
            })
          : formUrlQuery({
              params: searchParams.toString(),
              key: paramKey,
              value: null, // remove query param when default/empty
            });

      if (replace) {
        router.replace(newUrl, { scroll: false });
      } else {
        router.push(newUrl, { scroll: false });
      }

      onValueChange?.(value);
    }, debounceMs);

    return () => clearTimeout(t);
  }, [
    value,
    debounceMs,
    replace,
    router,
    searchParams,
    paramKey,
    defaultValue,
    onValueChange,
  ]);

  const handleChange = React.useCallback((v: string) => setValue(v), []);

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className={className} aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="font-grotesk">
        {items.map((it) => (
          <SelectItem key={it.value} value={it.value}>
            {it.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
