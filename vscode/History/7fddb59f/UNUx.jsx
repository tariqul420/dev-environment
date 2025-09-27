"use client";

import {
  createDragColumn,
  createSelectionColumn,
} from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import AdminProjectTableMenu from "./admin/admin-project-table-menu";

// blog columns for admin
export const adminProjectsColumns = [
  createDragColumn(),
  createSelectionColumn(),
  {
    accessorKey: "Title",
    header: "Title",
    cell: ({ row }) => (
      <h2 className="max-w-36 truncate text-sm font-medium">
        {row.original.title}
      </h2>
    ),
    filterFn: "includesString",
    enableHiding: false,
  },
  {
    accessorKey: "Featured",
    header: "Featured",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 py-1">
          {row.original.isFeatured ? "Featured" : "Normal"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "Order",
    header: "Order",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          #{row.original.order}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "Published",
    header: "Published",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 py-1">
          {row.original.isPublished ? "Published" : "Unpublished"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "Updated At",
    header: "Updated At",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 py-1">
          {format(new Date(row.original.updatedAt), "PPP")}
        </Badge>
      </div>
    ),
  },
  {
    id: "Actions",
    header: "Actions",
    cell: ({ row }) => <AdminProjectTableMenu row={row} />,
  },
];
