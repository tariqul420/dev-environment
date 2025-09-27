"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  clearQuery,
  isSameQuery,
  getCsvParam,
  setCsvParam,
  arraysShallowEqual,
} from "@/lib/url-helpers";

type Props = {
  statusCounts?: Record<string, number>;
};

export default function OrderFilters({ statusCounts = {} }: Props) {
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

  const clearAllParams = React.useCallback(() => {
    const prevQS = searchParams?.toString() ?? "";
    const nextQS = clearQuery(prevQS, [
      "search",
      "dateFrom",
      "dateTo",
      "adminId",
      "status",
      "sortBy",
      "sortDir",
      "pageIndex",
    ]);
    safeReplace(nextQS);
  }, [searchParams, safeReplace]);

  // --- status (CSV) ---
  const [statuses, setStatuses] = React.useState<string[]>(() =>
    getCsvParam(searchParams, "status")
  );

  // keep local state in sync with URL
  React.useEffect(() => {
    const urlStatuses = getCsvParam(searchParams, "status");
    if (!arraysShallowEqual(urlStatuses, statuses)) {
      setStatuses(urlStatuses);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const applyStatuses = (next: string[]) => {
    setStatuses(next); // instant UI
    const prevQS = searchParams?.toString() ?? "";
    const nextQS = setCsvParam(prevQS, "status", next, true);
    safeReplace(nextQS);
  };

    const toggleStatus = (s: string) => {
      const next = statuses.includes(s)
        ? statuses.filter((x) => x !== s)
        : [...statuses, s];
      applyStatuses(next);
    };

  return (
    <section className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white/60 p-4 backdrop-blur-md dark:bg-neutral-900/60">
      {Object.keys(statusCounts).length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusCounts).map(([k, v]) => {
            const active = statuses.includes(k);
            return (
              <Badge
                key={k}
                variant={active ? "default" : "secondary"}
                className="cursor-pointer text-xs capitalize"
                onClick={() => toggleStatus(k)}
                aria-label={`Toggle status ${k}`}
                title={`Toggle status ${k}`}
              >
                {k}: {v}
              </Badge>
            );
          })}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">No statuses.</div>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={clearAllParams}
        aria-label="Reset all filters"
      >
        Reset All
      </Button>
    </section>
  );
}
