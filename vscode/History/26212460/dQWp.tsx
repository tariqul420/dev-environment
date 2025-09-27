// Final clean DataTable.tsx with pagination-only skeleton loader

"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  Row,
  SortingState,
  Table as TableInstance,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import React from "react";
import DataTableFooter from "./data-table-footer";

export interface BaseRecord {
  _id?: string | number;
  id?: string | number;
  [key: string]: unknown;
}

interface DataTableProps<T extends BaseRecord> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSize: number;
  pageIndex: number;
  total: number;
  uniqueIdProperty?: string;
}

function usePrevious<T>(value: T): T | undefined {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default function DataTable<T extends BaseRecord>({
  data: initialData,
  columns,
  pageSize,
  pageIndex,
  total,
  uniqueIdProperty = "_id",
}: DataTableProps<T>) {
  const searchParams = useSearchParams();
  const [data, setData] = React.useState<T[]>(initialData);
  const [isTableLoading, setIsTableLoading] = React.useState(false);

  const currentPage = Number(searchParams.get("pageIndex")) || 1;
  const prevPage = usePrevious(currentPage);

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: pageIndex ? pageIndex - 1 : 0,
    pageSize,
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const uniqueIdRef = React.useRef(uniqueIdProperty);
  uniqueIdRef.current = uniqueIdProperty;

  const dataIds = React.useMemo(() => {
    return data
      .map((item) => {
        const id = item[uniqueIdRef.current] || item._id || item.id;
        return id as UniqueIdentifier;
      })
      .filter(Boolean);
  }, [data]);

  const table = useReactTable<T>({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    getRowId: (row) => {
      const id = row[uniqueIdRef.current] || row._id || row.id;
      return id ? id.toString() : "";
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  });

  React.useEffect(() => {
    const isPagination = prevPage !== undefined && prevPage !== currentPage;

    if (isPagination) {
      setIsTableLoading(true);
      const timeout = setTimeout(() => {
        setData(initialData);
        setIsTableLoading(false);
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      setData(initialData);
      setIsTableLoading(false);
    }
  }, [initialData, currentPage, prevPage]);

  const hasRows = table.getRowModel().rows.length > 0;
  const isActuallyLoading = isTableLoading || (!hasRows && data.length > 0);

  return (
    <div className="rounded-lg border">
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        sensors={useSensors(
          useSensor(MouseSensor),
          useSensor(TouchSensor),
          useSensor(KeyboardSensor),
        )}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isActuallyLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : hasRows ? (
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </SortableContext>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DndContext>
      <DataTableFooter table={table} pageSize={pageSize} total={total} />
    </div>
  );
}

// Helper function to create a drag column
export function createDragColumn<T extends BaseRecord>() {
  return {
    id: "drag",
    header: () => null,
    cell: ({ row }: { row: Row<T> }) => {
      // Access the id directly from the row original data
      const id = row.original._id || row.original.id || row.id;
      return <DragHandle id={id as UniqueIdentifier} />;
    },
  };
}

// Helper function to create a selection checkbox column
export function createSelectionColumn<T extends BaseRecord>() {
  return {
    id: "select",
    header: ({ table }: { table: TableInstance<T> }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className={"border-[#e9e4e4] dark:border-[#383838]"}
        />
      </div>
    ),
    cell: ({ row }: { row: Row<T> }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  };
}
