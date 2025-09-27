"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { DateRange } from "react-day-picker";
import { setQuery, clearQuery, isSameQuery } from "@/lib/url-helpers";
import { Badge } from "@/components/ui/badge";

type Props = {
  statusCounts?: Record<string, number>;
  initialSearch?: string;
  initialDateFrom?: string;
  initialDateTo?: string;
  selectedAdminId?: string;
  initialSortBy?: "createdAt" | "updatedAt" | "status" | "admin" | "name" | "orderId";
  initialSortDir?: "asc" | "desc";
  initialStatus?: string | string[];
};

const parseCsv = (v?: string | null) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []);

export default function OrderFilters({
  statusCounts = {},
  initialDateFrom = "",
  initialDateTo = "",
  selectedAdminId = "",
  initialStatus = "",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const safeReplace = React.useCallback(
    (nextQS: string) => {
      const prevQS = searchParams?.toString() ?? "";
      if (!isSameQuery(prevQS, nextQS)) {
        router.replace(`${pathname}?${nextQS}`, { scroll: false });
      }
    },
    [pathname, router, searchParams]
  );

  const writeParams = React.useCallback(
    (pairs: Record<string, string | undefined>) => {
      const prevQS = searchParams?.toString() ?? "";
      // Always reset pagination on filter change
      const withPageReset = { ...pairs, pageIndex: "1" };
      const nextQS = setQuery(prevQS, withPageReset);
      safeReplace(nextQS);
    },
    [searchParams, safeReplace]
  );

  const clearAllParams = React.useCallback(() => {
    const prevQS = searchParams?.toString() ?? "";
    const nextQS = clearQuery(prevQS, ["search", "dateFrom", "dateTo", "adminId", "status", "sortBy", "sortDir", "pageIndex"]);
    safeReplace(nextQS);
  }, [searchParams, safeReplace]);

  // ---------- Date Range ----------
  const [range, setRange] = React.useState<DateRange | undefined>(() => {
    const parse = (s?: string | null) => (s ? new Date(s) : undefined);
    const from = parse(searchParams?.get("dateFrom") ?? initialDateFrom);
    const to = parse(searchParams?.get("dateTo") ?? initialDateTo);
    return from || to ? { from, to } : undefined;
  });

  // ---------- Admin ----------
  const [adminId, setAdminId] = React.useState<string>(() => searchParams?.get("adminId") ?? selectedAdminId ?? "");

  // Keep in sync with URL changes
  React.useEffect(() => {
    const urlAdmin = searchParams?.get("adminId") ?? "";
    if (urlAdmin !== adminId) setAdminId(urlAdmin);

    const urlFrom = searchParams?.get("dateFrom");
    const urlTo = searchParams?.get("dateTo");
    const nextRange = urlFrom || urlTo ? { from: urlFrom ? new Date(urlFrom) : undefined, to: urlTo ? new Date(urlTo) : undefined } : undefined;

    const same =
      (!!range?.from === !!nextRange?.from) &&
      (!!range?.to === !!nextRange?.to) &&
      (!range?.from || !nextRange?.from || range.from.getTime() === nextRange.from.getTime()) &&
      (!range?.to || !nextRange?.to || range.to.getTime() === nextRange.to.getTime());

    if (!same) setRange(nextRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ---------- Status (multi) ----------
  const initialStatusCsv =
    searchParams?.get("status") ?? (Array.isArray(initialStatus) ? initialStatus.join(",") : (initialStatus ?? ""));
  const [statuses, setStatuses] = React.useState<string[]>(parseCsv(initialStatusCsv));

  React.useEffect(() => {
    const urlStatuses = parseCsv(searchParams?.get("status"));
    const same = urlStatuses.length === statuses.length && urlStatuses.every((x, i) => x === statuses[i]);
    if (!same) setStatuses(urlStatuses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const applyStatuses = (next: string[]) => {
    setStatuses(next);
    writeParams({ status: next.length ? next.join(",") : undefined });
  };

  const toggleStatus = (s: string) => {
    const set = new Set(statuses);
    set.has(s) ? set.delete(s) : set.add(s);
    applyStatuses(Array.from(set));
  };

  return (
    <section className="mb-4 rounded-xl border bg-white/60 p-4 backdrop-blur-md dark:bg-neutral-900/60 flex items-center justify-between flex-wrap">
      {statusCounts && Object.keys(statusCounts).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusCounts).map(([k, v]) => {
            const active = statuses.includes(k);
            return (
              <Badge key={k} variant={active ? "default" : "secondary"} className="cursor-pointer text-xs capitalize" onClick={() => toggleStatus(k)}>
                {k}: {v}
              </Badge>
            );
          })}
        </div>
      )}

       <Button variant="ghost" size="sm" className="gap-2" onClick={clearAllParams} aria-label="Reset all filters">
          Reset All
        </Button>
    </section>
  );
}
