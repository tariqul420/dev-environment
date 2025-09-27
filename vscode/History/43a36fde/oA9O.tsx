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

import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils/utils";
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
    let newUrl = "";

    if (value) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "pageSize",
        value,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["pageSize"],
      });
    }
    router.push(newUrl, { scroll: false });
    table.setPageSize(Number(value));
  };

  return (
    <div className="flex justify-between gap-4 px-4 py-2 lg:items-center">
      {/* Selected Rows Summary (optional) */}
      <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      <div className="flex w-full flex-col justify-center gap-3 lg:w-fit lg:flex-row lg:items-center lg:gap-8">
        {/* Rows Per Page Selector */}
        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            Rows per page
          </Label>
          <Select value={`${pageSize}`} onValueChange={handlePageSizeChange}>
            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
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

        {/* Showing Range Info */}
        <div className="text-sm">
          Showing {(currentPage - 1) * pageSize + 1}–
          {Math.min(currentPage * pageSize, total)} of {total} orders
        </div>

        {/* Pagination Controls */}
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(1)}
            disabled={currentPage <= 1}
          >
            <span className="sr-only">Go to first page</span>
            <IconChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <span className="sr-only">Go to previous page</span>
            <IconChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <IconChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage >= totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <IconChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
