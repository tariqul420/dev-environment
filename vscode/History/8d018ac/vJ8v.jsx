"use client";

import {
  createDragColumn,
  createSelectionColumn,
} from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import AdminProjectTableMenu from "./admin/admin-project-table-menu";
import AdminServiceTableMenu from "./admin/admin-service-table-menu";


function fmtAmount(n) {
  const v = Number(n || 0);
  return isFinite(v) ? v.toFixed(2) : "0.00";
}

function statusColor(status) {
  switch (status) {
    case "success":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "failed":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "refunded":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "disputed":
      return "bg-purple-50 text-purple-700 border-purple-200";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

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

export const adminServiceColumns = [
  createDragColumn(),
  createSelectionColumn(),
  {
    accessorKey: "Name",
    header: "Name",
    cell: ({ row }) => (
      <h2 className="max-w-36 truncate text-sm font-medium">
        {row.original.name}
      </h2>
    ),
    filterFn: "includesString",
    enableHiding: false,
  },
  {
    accessorKey: "Phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 py-1">
          {row.original.phone}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "Email",
    header: "Email",
    cell: ({ row }) => (
      <div className="w-48 text-sm whitespace-normal break-all">
        <Badge
          variant="outline"
          className="block w-full text-left px-1.5 py-1 whitespace-normal break-all leading-snug"
        >
          {row.original.email || "N/A"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-1.5 py-1 capitalize">
        {row.original.status}
      </Badge>
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
    accessorKey: "Remarks",
    header: "Remarks",
    cell: ({ row }) => (
      <div className="w-48 text-sm whitespace-normal break-all">
        <Badge
          variant="outline"
          className="block w-full text-left px-1.5 py-1 whitespace-normal break-all leading-snug"
        >
          {row.original.remarks || "N/A"}
        </Badge>
      </div>
    ),
  },
  {
    id: "Actions",
    header: "Actions",
    cell: ({ row }) => <AdminServiceTableMenu row={row} />,
  },
];

const payment
