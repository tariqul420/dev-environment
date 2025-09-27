"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import AdminCategoryTableMenu from "./admin/category/admin-category-table-menu";
import AdminProductTableMenu from "./admin/products/admin-product-table-menu";
import AdminUserTableMenu from "./admin/user/admin-user-table-menu";
import { createSelectionColumn } from "./data-table";

export const adminProductsColumns: ColumnDef<ProductRecord>[] = [
  createSelectionColumn<ProductRecord>(),
  {
    accessorKey: "Title",
    header: "Title",
    cell: ({ row }: { row: Row<ProductRecord> }) => (
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
    cell: ({ row }: { row: Row<ProductRecord> }) => {
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
    accessorKey: "Stock",
    header: "Stock",
    cell: ({ row }: { row: Row<ProductRecord> }) => <>{row.original.stock}</>,
  },
  {
    accessorKey: "Sale Price",
    header: "Price",
    cell: ({ row }: { row: Row<ProductRecord> }) => (
      <>{row.original.compareAtPrice - row.original.price} TK</>
    ),
  },
  {
    accessorKey: "Images",
    header: "Images",
    cell: ({ row }: { row: Row<ProductRecord> }) => (
      <>{row.original._count.images}</>
    ),
  },
  {
    accessorKey: "Last Update",
    header: "Last Update",
    cell: ({ row }: { row: Row<ProductRecord> }) => (
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

// category columns for admin
export const adminCategoryColumns: ColumnDef<CategoryRecord>[] = [
  createSelectionColumn<CategoryRecord>(),
  {
    accessorKey: "Name",
    header: "Name",
    cell: ({ row }: { row: Row<CategoryRecord> }) => (
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
    cell: ({ row }: { row: Row<CategoryRecord> }) => (
      <>{row.original._count.products}</>
    ),
  },
  {
    accessorKey: "Children",
    header: "Children",
    cell: ({ row }: { row: Row<CategoryRecord> }) => (
      <>{row.original._count.children}</>
    ),
  },
  {
    accessorKey: "Created At",
    header: "Created At",
    cell: ({ row }: { row: Row<CategoryRecord> }) => (
      <span title={format(new Date(row.original.createdAt), "PPPP")}>
        {format(new Date(row.original.createdAt), "PP")}
      </span>
    ),
  },
  {
    accessorKey: "Last Update",
    header: "Last Update",
    cell: ({ row }: { row: Row<CategoryRecord> }) => (
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

export const adminUsersColumns: ColumnDef<UserRecord>[] = [
  createSelectionColumn<UserRecord>(),
  {
    accessorKey: "Name & Mail",
    header: "Name & Mail",
    cell: ({ row }: { row: Row<UserRecord> }) => (
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
    cell: ({ row }: { row: Row<UserRecord> }) => {
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
    cell: ({ row }: { row: Row<UserRecord> }) => (
      <>{row.original.totalOrders}</>
    ),
  },
  {
    accessorKey: "Complete Orders",
    header: "Complete",
    cell: ({ row }: { row: Row<UserRecord> }) => (
      <>{row.original.completedOrders}</>
    ),
  },
  {
    accessorKey: "Last Order",
    header: "Last Order",
    cell: ({ row }: { row: Row<UserRecord> }) => (
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
    cell: ({ row }: { row: Row<UserRecord> }) => (
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
