"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import Link from "next/link";
import { productCellSummary } from "@/lib/utils/order";
import { getShortReferral } from "@/lib/utils/parse-referral";
import getStatusIcon, {
  getStatusColorClass,
  getStatusLabel,
} from "@/lib/utils/status";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import AdminCategoryTableMenu from "./admin/category/admin-category-table-menu";
import AdminOrderTableMenu from "./admin/orders/admin-order-table-menu";
import AdminProductTableMenu from "./admin/products/admin-product-table-menu";
import AdminUserTableMenu from "./admin/user/admin-user-table-menu";
import { createSelectionColumn } from "./data-table";
import TimeCell from "./time-cell";

export const adminProductsColumns: ColumnDef<AdminProductRow>[] = [
  createSelectionColumn<AdminProductRow>(),
  {
    accessorKey: "Title",
    header: "Title",
    cell: ({ row }: { row: Row<AdminProductRow> }) => (
      <h2 className="max-w-36 truncate text-sm font-medium">
        {row.original.title}
      </h2>
    ),
    filterFn: "includesString",
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: Row<AdminProductRow> }) => {
      const status = row.original.status as "DRAFT" | "ACTIVE" | "ARCHIVED";

      const variant =
        status === "ACTIVE"
          ? "default"
          : status === "DRAFT"
            ? "secondary"
            : "destructive";

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }: { row: Row<AdminProductRow> }) => {
      const stock = row.original.stock;

      let label = "";
      let variant: "default" | "secondary" | "destructive" | "outline" =
        "default";

      if (stock <= 0) {
        label = "Out of Stock";
        variant = "destructive";
      } else if (stock < 5) {
        label = "Low Stock";
        variant = "secondary";
      } else {
        label = "In Stock";
        variant = "default";
      }

      return (
        <div className="flex items-center gap-2">
          <Badge variant={variant}>{label}</Badge>
          <span className="text-xs text-muted-foreground">({stock})</span>
        </div>
      );
    },
  },
  {
    accessorKey: "Sale Price",
    header: "Price",
    cell: ({ row }: { row: Row<AdminProductRow> }) => (
      <>{row.original.price} TK</>
    ),
  },
  {
    accessorKey: "Images",
    header: "Images",
    cell: ({ row }: { row: Row<AdminProductRow> }) => (
      <>{row.original._count.images}</>
    ),
  },
  {
    accessorKey: "Last Update",
    header: "Last Update",
    cell: ({ row }: { row: Row<AdminProductRow> }) => (
      <span title={format(new Date(row.original.updatedAt), "PPPP")}>
        {format(new Date(row.original.updatedAt), "PP")}
      </span>
    ),
  },
  {
    id: "Actions",
    header: "Actions",
    cell: ({ row }) => <AdminProductTableMenu row={row} />,
  },
];

export const adminCategoryColumns: ColumnDef<AdminCategoryRow>[] = [
  createSelectionColumn<AdminCategoryRow>(),
  {
    accessorKey: "Name",
    header: "Name",
    cell: ({ row }: { row: Row<AdminCategoryRow> }) => (
      <h2 className="max-w-36 truncate text-sm font-medium">
        {row.original.name}
      </h2>
    ),
    filterFn: "includesString",
    enableHiding: false,
  },
  {
    accessorKey: "Products",
    header: "Products",
    cell: ({ row }: { row: Row<AdminCategoryRow> }) => (
      <>{row.original._count.products}</>
    ),
  },
  {
    accessorKey: "Children",
    header: "Children",
    cell: ({ row }: { row: Row<AdminCategoryRow> }) => (
      <>{row.original._count.children}</>
    ),
  },
  {
    accessorKey: "Created At",
    header: "Created At",
    cell: ({ row }: { row: Row<AdminCategoryRow> }) => (
      <span title={format(new Date(row.original.createdAt), "PPPP")}>
        {format(new Date(row.original.createdAt), "PP")}
      </span>
    ),
  },
  {
    accessorKey: "Last Update",
    header: "Last Update",
    cell: ({ row }: { row: Row<AdminCategoryRow> }) => (
      <span title={format(new Date(row.original.updatedAt), "PPPP")}>
        {format(new Date(row.original.updatedAt), "PP")}
      </span>
    ),
  },
  {
    id: "Actions",
    header: "Actions",
    cell: ({ row }) => <AdminCategoryTableMenu row={row} />,
  },
];

export const adminUsersColumns: ColumnDef<AdminUserRow>[] = [
  createSelectionColumn<AdminUserRow>(),
  {
    accessorKey: "Name & Mail",
    header: "Name & Mail",
    cell: ({ row }: { row: Row<AdminUserRow> }) => (
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={row.original.imageUrl} alt={row.original.name} />
          <AvatarFallback>{row.original.name}</AvatarFallback>
        </Avatar>

        <div>
          <h2 className="max-w-36 truncate text-sm font-medium">
            {row.original.name}
          </h2>
          <p className="text-muted-foreground text-sm">{row.original.email}</p>
        </div>
      </div>
    ),
    filterFn: "includesString",
    enableHiding: false,
  },
  {
    accessorKey: "Role",
    header: "Role",
    cell: ({ row }: { row: Row<AdminUserRow> }) => {
      const role = row.original.role;
      const roleVariant =
        role === "ADMIN"
          ? "destructive"
          : role === "STAFF"
            ? "secondary"
            : "default";

      return <Badge variant={roleVariant}>{role}</Badge>;
    },
  },
  {
    accessorKey: "Total Orders",
    header: "Orders",
    cell: ({ row }: { row: Row<AdminUserRow> }) => (
      <>{row.original.totalOrders}</>
    ),
  },
  {
    accessorKey: "Complete Orders",
    header: "Complete",
    cell: ({ row }: { row: Row<AdminUserRow> }) => (
      <>{row.original.completedOrders}</>
    ),
  },
  {
    accessorKey: "Total Spent",
    header: "Spent",
    cell: ({ row }: { row: Row<AdminUserRow> }) => (
      <>{row.original.totalSpent}</>
    ),
  },
  {
    accessorKey: "Last Order",
    header: "Last Order",
    cell: ({ row }: { row: Row<AdminUserRow> }) => (
      <>
        {row.original.lastOrderAt ? (
          <span title={format(new Date(row.original.lastOrderAt), "PPPP")}>
            {format(new Date(row.original.lastOrderAt), "PP")}
          </span>
        ) : (
          <span>No Orders</span>
        )}
      </>
    ),
  },
  {
    accessorKey: "Last Updated",
    header: "Last Updated",
    cell: ({ row }: { row: Row<AdminUserRow> }) => (
      <span title={format(new Date(row.original.updatedAt), "PPPP")}>
        {format(new Date(row.original.updatedAt), "PP")}
      </span>
    ),
  },
  {
    id: "Actions",
    header: "Actions",
    cell: ({ row }) => <AdminUserTableMenu row={row} />,
  },
];

export const adminOrdersColumns: ColumnDef<AdminOrderRow>[] = [
  createSelectionColumn<AdminOrderRow>(),
  {
    accessorKey: "orderNo",
    header: "Order ID",
    cell: ({ row }) => <div className="w-32">{row.original.orderNo}</div>,
    filterFn: "includesString",
    enableHiding: false,
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <h2 className="max-w-36 truncate text-sm font-medium">
          {row.original.customerName}
        </h2>
        <p className="text-muted-foreground text-xs">
          {row.original.customerPhone}
        </p>
      </div>
    ),
    filterFn: "includesString",
    enableHiding: false,
  },
  {
    id: "product",
    header: "Product",
    cell: ({ row }) => {
      const { title, line } = productCellSummary(
        row.original.items,
        row.original.total,
        row.original.currency,
      );
      return (
        <div className="flex flex-col">
          <h2 className="max-w-36 truncate text-sm font-medium">{title}</h2>
          <p className="text-muted-foreground text-xs">{line}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status;
      const label = getStatusLabel(s);

      return (
        <Badge
          variant="outline"
          title={label}
          className={`px-1.5 capitalize ${getStatusColorClass(s)}`}
        >
          {getStatusIcon(s)}
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "Order Date",
    header: "Order Date",
    cell: ({ row }) => <TimeCell createdAt={row.original.createdAt} />,
  },
  {
    id: "admin",
    header: "Admin",
    cell: ({ row }) => (
      <h2 className="max-w-36 truncate text-sm font-medium">
        {row.original.statusUpdatedBy?.name?.trim() || "-"}
      </h2>
    ),
  },
  {
    id: "referral",
    header: "Referral",
    cell: ({ row }) => (
      <p className="max-w-36 truncate text-sm font-medium">
        {row.original.referral ? getShortReferral(row.original.referral) : "-"}
      </p>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <AdminOrderTableMenu row={row} />,
  },
];

export const customerOrdersColumns: ColumnDef<CustomerOrderRow>[] = [
  createSelectionColumn<CustomerOrderRow>(),
  {
    accessorKey: "Order ID",
    header: "Order ID",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          {row.original.orderId}
        </Badge>
      </div>
    ),
    filterFn: "includesString",
    enableHiding: false,
  },
  {
    accessorKey: "Customer",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <h2 className="max-w-36 truncate text-sm font-medium">
          {row.original.name}
        </h2>
        <p className="text-muted-foreground text-xs">{row.original.phone}</p>
      </div>
    ),
    filterFn: "includesString",
    enableHiding: false,
  },
  {
    accessorKey: "Product",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex flex-col">
        {row.original.product ? (
          <>
            <h2 className="max-w-36 truncate text-sm font-medium">
              {row.original.product.title}
            </h2>
            <p className="text-muted-foreground text-xs">
              {row.original.quantity} x {row.original.product.salePrice}৳
            </p>
          </>
        ) : (
          <p className="text-sm text-red-500">Product deleted</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "Total Price",
    header: "Total Price",
    cell: ({ row }) => {
      return (
        <div className="w-32">
          <Badge variant="outline" className="rounded px-1.5">
            {row.original.total} ৳
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`px-1.5 capitalize ${getStatusColorClass(row.original.status as string)}`}
      >
        {getStatusIcon(row.original.status as string)}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "Order Date",
    header: "Order Date",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          {format(new Date(row.original.createdAt), "PPP")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "Order Details",
    header: "Order Details",
    cell: ({ row }) => {
      const orderId = row.original.orderId;
      const formateOrderId = orderId.replace("#", "");

      return (
        <div className="w-32">
          <Link
            target="_blank"
            href={`/receipt/${row.original.phone}-${formateOrderId}`}
          >
            <Button
              variant="outline"
              className="inline-flex items-center justify-center gap-2"
            >
              <Eye className="h-4 w-4" />
              <span>View</span>
            </Button>
          </Link>
        </div>
      );
    },
  },
];
