"use client";

import AdminBlogTableMenu from "@/components/dashboard/admin/blog/admin-blog-table-menu";
import AdminCategoryTableMenu from "@/components/dashboard/admin/category/admin-category-table-menu";
import AdminOrderTableMenu from "@/components/dashboard/admin/order/admin-order-table-menu";
import AdminProductTableMenu from "@/components/dashboard/admin/product/admin-product-table-menu";
import ReviewTableMenu from "@/components/dashboard/admin/product/review-table-menu";
import {
  createDragColumn,
  createSelectionColumn,
} from "@/components/dashboard/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getShortReferral } from "@/lib/parse-referral";
import getStatusIcon, { getStatusColorClass } from "@/lib/utils/status";
import {
  BlogRecord,
  CategoryRecord,
  OrderRecord,
  OrderRecordForCustomer,
  ProductRecord,
  ReviewRecord,
  UserRecord,
} from "@/types/table-columns";
import { ColumnDef, Row } from "@tanstack/react-table";
import { differenceInHours, format, formatDistanceToNowStrict } from "date-fns";
import { Eye } from "lucide-react";
import Link from "next/link";

// product columns for admin
export const adminProductsColumns: ColumnDef<ProductRecord>[] = [
  createDragColumn<ProductRecord>(),
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
    accessorKey: "Category",
    header: "Category",
    cell: ({ row }: { row: Row<ProductRecord> }) => (
      <div className="max-w-56 truncate text-sm">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          {row.original.categoryIds
            .slice(0, 2)
            .map((cat) => cat.name)
            .join(", ") + (row.original.categoryIds.length > 2 ? ", ..." : "")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "Sale Price",
    header: "Price",
    cell: ({ row }: { row: Row<ProductRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          {row.original.salePrice} TK
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "Updated At",
    header: "Updated At",
    cell: ({ row }: { row: Row<ProductRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          {format(new Date(row.original.updatedAt), "PPP")}
        </Badge>
      </div>
    ),
  },
  {
    id: "Actions",
    header: "Actions",
    cell: ({ row }) => <AdminProductTableMenu row={row} />,
  },
];

// blog columns for admin
export const adminBlogsColumns: ColumnDef<BlogRecord>[] = [
  createDragColumn<BlogRecord>(),
  createSelectionColumn<BlogRecord>(),
  {
    accessorKey: "Title",
    header: "Title",
    cell: ({ row }: { row: Row<BlogRecord> }) => (
      <h2 className="max-w-36 truncate text-sm font-medium">
        {row.original.title}
      </h2>
    ),
    filterFn: "includesString",
    enableHiding: false,
  },
  {
    accessorKey: "Created At",
    header: "Created At",
    cell: ({ row }: { row: Row<BlogRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          {format(new Date(row.original.createdAt), "PPP")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "Updated At",
    header: "Updated At",
    cell: ({ row }: { row: Row<BlogRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          {format(new Date(row.original.updatedAt), "PPP")}
        </Badge>
      </div>
    ),
  },
  {
    id: "Actions",
    header: "Actions",
    cell: ({ row }) => <AdminBlogTableMenu row={row} />,
  },
];

// review columns for admin
export const adminReviewsColumns: ColumnDef<ReviewRecord>[] = [
  createDragColumn<ReviewRecord>(),
  createSelectionColumn<ReviewRecord>(),
  {
    accessorKey: "Rating",
    header: "Rating",
    cell: ({ row }: { row: Row<ReviewRecord> }) => (
      <h2 className="max-w-36 truncate text-sm font-medium">
        {row.original.rating}
      </h2>
    ),
    filterFn: "includesString",
    enableHiding: false,
  },
  {
    accessorKey: "Review",
    header: "Review",
    cell: ({ row }: { row: Row<ReviewRecord> }) => (
      <p className="text-muted-foreground max-w-36 truncate text-sm">
        {row.original.review}
      </p>
    ),
    filterFn: "includesString",
    enableHiding: false,
  },
  {
    accessorKey: "Created At",
    header: "Created At",
    cell: ({ row }: { row: Row<ReviewRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          {format(new Date(row.original.createdAt), "PPP")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "Updated At",
    header: "Updated At",
    cell: ({ row }: { row: Row<ReviewRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          {format(new Date(row.original.updatedAt), "PPP")}
        </Badge>
      </div>
    ),
  },
  {
    id: "Actions",
    header: "Actions",
    cell: ({ row }) => <ReviewTableMenu row={row} />,
  },
];

// Customer columns for admin
export const adminUsersColumns: ColumnDef<UserRecord>[] = [
  createDragColumn<UserRecord>(),
  createSelectionColumn<UserRecord>(),
  {
    accessorKey: "Name & Mail",
    header: "Name & Mail",
    cell: ({ row }: { row: Row<UserRecord> }) => (
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src={row.original.profilePicture}
            alt={row.original.firstName}
          />
          <AvatarFallback>{row.original.firstName}</AvatarFallback>
        </Avatar>

        <div>
          <h2 className="max-w-36 truncate text-sm font-medium">
            {row.original.firstName} {row.original.lastName}
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
    cell: ({ row }: { row: Row<UserRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1 capitalize">
          {row.original.role}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "Total Orders",
    header: "Total Orders",
    cell: ({ row }: { row: Row<UserRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1 capitalize">
          {row.original.totalOrderCount}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "Complete Orders",
    header: "Complete Orders",
    cell: ({ row }: { row: Row<UserRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1 capitalize">
          {row.original.completedOrderCount}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "Created At",
    header: "Created At",
    cell: ({ row }: { row: Row<UserRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          {format(new Date(row.original.createdAt), "PPP")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "Updated At",
    header: "Updated At",
    cell: ({ row }: { row: Row<UserRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          {format(new Date(row.original.updatedAt), "PPP")}
        </Badge>
      </div>
    ),
  },
];

// category columns for admin
export const adminCategoryColumns: ColumnDef<CategoryRecord>[] = [
  createDragColumn<CategoryRecord>(),
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
    accessorKey: "Created At",
    header: "Created At",
    cell: ({ row }: { row: Row<CategoryRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          {format(new Date(row.original.createdAt), "PPP")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "Updated At",
    header: "Updated At",
    cell: ({ row }: { row: Row<CategoryRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          {format(new Date(row.original.updatedAt), "PPP")}
        </Badge>
      </div>
    ),
  },
  {
    id: "Actions",
    header: "Actions",
    cell: ({ row }) => <AdminCategoryTableMenu row={row} />,
  },
];

// order columns for admin
export const adminOrdersColumns: ColumnDef<OrderRecord>[] = [
  createDragColumn<OrderRecord>(),
  createSelectionColumn<OrderRecord>(),
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
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`px-1.5 capitalize ${getStatusColorClass(row.original.status)}`}
      >
        {getStatusIcon(row.original.status)}
        {row.original.status}
      </Badge>
    ),
  },
  {
  accessorKey: "createdAt",
  header: "Order Date",
  cell: ({ row }) => {
    const [tick, setTick] = useState(0);
    const createdAt = new Date(row.original.createdAt);

    useEffect(() => {
      const id = setInterval(() => {
        setTick((t) => t + 1); // force re-render
      }, 1000);
      return () => clearInterval(id);
    }, []);

    const hoursAgo = differenceInHours(new Date(), createdAt);

    const displayText =
      hoursAgo < 24
        ? formatDistanceToNowStrict(createdAt, { addSuffix: true })
        : format(createdAt, "PPP");

    return (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          {displayText}
        </Badge>
      </div>
    );
  },
},
  {
    id: "Admin",
    header: "Admin",
    cell: ({ row }) => {
      return (
        <h2 className="max-w-36 truncate text-sm font-medium">
          {row.original.admin
            ? `${row.original.admin.firstName} ${row.original.admin.lastName}`
            : `-`}
        </h2>
      );
    },
  },
  {
    id: "Referral",
    header: "Referral",
    cell: ({ row }) => {
      return (
        <p className="max-w-36 truncate text-sm font-medium">
          {getShortReferral(row.original.referral)}
        </p>
      );
    },
  },
  {
    id: "Actions",
    header: "Actions",
    cell: ({ row }) => <AdminOrderTableMenu row={row} />,
  },
];

// order columns for customer
export const customerOrdersColumns: ColumnDef<OrderRecordForCustomer>[] = [
  createDragColumn<OrderRecordForCustomer>(),
  createSelectionColumn<OrderRecordForCustomer>(),
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
      const totalPrice = row.original.product?.salePrice
        ? row.original.product.salePrice * row.original.quantity
        : 0;

      return (
        <div className="w-32">
          <Badge variant="outline" className="rounded px-1.5">
            {totalPrice} ৳
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
    accessorKey: "Created At",
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
