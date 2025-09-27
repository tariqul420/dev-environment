"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

type SortItem = {
  value: string;
  label: string;
};

type SortSelectProps = {
  items: SortItem[];
  /** URL query key to write to (e.g., "sort", "orderBy") */
  paramKey?: string;
  /** Placeholder when nothing selected */
  placeholder?: string;
  /** Default value when URL has no value ("" means remove the param) */
  defaultValue?: string;
  /** Debounce ms for URL updates */
  debounceMs?: number;
  /** Use router.replace instead of push to avoid stacking history */
  replace?: boolean;
  /** Additional classes for the trigger */
  className?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
};

export default function SortSelect({
  items,
  paramKey = "sort",
  placeholder = "Default sorting",
  defaultValue = "",
  debounceMs = 400,
  replace = true,
  className,
  onValueChange,
}: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  // Initial value from URL once on mount
  const initialFromUrl = React.useMemo(
    () => searchParams?.get(paramKey) ?? defaultValue,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [value, setValue] = React.useState(initialFromUrl);

  // Keep state in sync with URL if user navigates (back/forward)
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
              value: null, // remove param when equals default
            });

      replace
        ? router.replace(newUrl, { scroll: false })
        : router.push(newUrl, { scroll: false });

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

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className={className ?? "w-full md:w-48"}>
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
