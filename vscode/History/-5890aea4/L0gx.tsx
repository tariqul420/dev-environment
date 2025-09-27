"use client";

import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import { Table } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { BaseRecord } from "./data-table";

interface DataTableFooterProps<TData extends BaseRecord> {
  table: Table<TData>;
  pageSize: number;
  total: number;
}

export default function DataTableFooter<TData extends BaseRecord>({
  table,
  pageSize,
  total,
}: DataTableFooterProps<TData>) {
  const searchParams = useSearchParams();
  const router = useRouter();

  if (!searchParams) return null;
  const currentPage = Number(searchParams.get("pageIndex")) || 1;
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (newPage: number) => {
    const query = formUrlQuery({
      params: searchParams.toString(),
      key: "pageIndex",
      value: newPage.toString(),
    });

    router.push(query, { scroll: false });
    table.setPageIndex(newPage - 1);
  };

  const handlePageSizeChange = (value: string) => {
    const newUrl = value
      ? formUrlQuery({
          params: searchParams.toString(),
          key: "pageSize",
          value,
        })
      : removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["pageSize"],
        });

    router.push(newUrl, { scroll: false });
    table.setPageSize(Number(value));
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Selected Rows Summary */}
      <div className="text-muted-foreground hidden text-sm lg:block">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected
      </div>

      <div className="flex flex-col items-start gap-3 sm:w-full sm:flex-row sm:items-center sm:justify-between lg:w-auto">
        {/* Rows Per Page - Only on large screens */}
        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm">
            Rows per page
          </Label>
          <Select value={`${pageSize}`} onValueChange={handlePageSizeChange}>
            <SelectTrigger id="rows-per-page" size="sm" className="w-20">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Range Info */}
        <div className="text-muted-foreground text-sm">
          Showing {(currentPage - 1) * pageSize + 1}–
          {Math.min(currentPage * pageSize, total)} of {total} rows
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden h-8 w-8 p-0 lg:inline-flex"
            onClick={() => handlePageChange(1)}
            disabled={currentPage <= 1}
          >
            <IconChevronsLeft className="h-4 w-4" />
            <span className="sr-only">First page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <IconChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <IconChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden h-8 w-8 lg:inline-flex"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage >= totalPages}
          >
            <IconChevronsRight className="h-4 w-4" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
