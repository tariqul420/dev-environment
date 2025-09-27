"use client";

import {
  createDragColumn,
  createSelectionColumn,
} from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import AdminProjectTableMenu from "./admin/admin-project-table-menu";
import AdminServiceTableMenu from "./admin/admin-service-table-menu";
import AdminPaymentTableMenu from "./admin/admin-payment-table-menu";
import { cn } from "@/lib/utils";


function fmtAmount(n) {
  const v = Number(n || 0);
  return isFinite(v) ? v.toFixed(2) : "0.00";
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

export const adminPaymentsColumns = [
  createDragColumn(),
  createSelectionColumn(),

  {
    accessorKey: "name",
    header: "Payer",
    cell: ({ row }) => (
      <div className="max-w-40 truncate text-sm font-medium">
        {row.original?.name || "—"}
      </div>
    ),
    filterFn: "includesString",
    enableHiding: false,
  },
  {
    accessorKey: "paymentMethod",
    header: "Method",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-1.5 py-1 capitalize">
        {String(row.original?.paymentMethod || "—").replace("_", " ")}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const cur = row.original?.currency || "BDT";
      return (
        <div className="w-32">
          <Badge variant="outline" className="px-1.5 py-1">
            {fmtAmount(row.original?.amount)} {cur}
          </Badge>
        </div>
      );
    },
    sortingFn: (a, b) => (Number(a.original.amount) || 0) - (Number(b.original.amount) || 0),
  },
  {
    accessorKey: "fees",
    header: "Fees",
    cell: ({ row }) => {
      const cur = row.original?.currency || "BDT";
      return (
        <div className="w-28">
          <Badge variant="outline" className="px-1.5 py-1">
            {fmtAmount(row.original?.fees)} {cur}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "netAmount",
    header: "Net",
    cell: ({ row }) => {
      const cur = row.original?.currency || "BDT";
      return (
        <div className="w-28">
          <Badge className="px-1.5 py-1" variant="secondary">
            {fmtAmount(row.original?.netAmount)} {cur}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => {
      return (
        <div className="w-28">
          <Badge className="px-1.5 py-1" variant="secondary">
            {fmtAmount(row.original?.totalAmount)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="w-32">
           <Badge className="px-1.5 py-1 capitalize" variant="secondary">
          {row.original?.status || "—"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "paidAt",
    header: "Paid At",
    cell: ({ row }) => {
      const d = row.original?.paidAt ? new Date(row.original.paidAt) : null;
      return (
        <div className="w-40">
          <Badge variant="outline" className="px-1.5 py-1">
            {d ? format(d, "PPp") : "—"}
          </Badge>
        </div>
      );
    },
    sortingFn: (a, b) =>
      new Date(a.original.paidAt || 0).getTime() - new Date(b.original.paidAt || 0).getTime(),
  },
  {
    accessorKey: "orderId",
    header: "Order",
    cell: ({ row }) => (
      <div className="w-28">
        <Badge variant="outline" className="px-1.5 py-1">
          {row.original?.orderId || "—"}
        </Badge>
      </div>
    ),
  },
  {
    id: "Actions",
    header: "Actions",
    cell: ({ row }) => <AdminPaymentTableMenu row={row} />,
  },
];
