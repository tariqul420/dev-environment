"use client";

import {
  IconCalendar,
  IconDotsVertical,
  IconMapPin,
  IconPackage,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import type { Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { ClipboardListIcon, HandHelpingIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { deleteOrder, updateOrderStatus } from "@/lib/actions/order.action";
import { getStatusColorClass } from "@/lib/utils/status";

interface AdminOrderTableMenuProps {
  row: Row<AdminOrderRow>;
}

const STATUS_MAP = {
  pending: "PENDING",
  confirmed: "CONFIRMED",
  processing: "PROCESSING",
  shipped: "SHIPPED",
  delivered: "DELIVERED",
  cancelled: "CANCELLED",
} as const;

export default function AdminOrderTableMenu({ row }: AdminOrderTableMenuProps) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const pathname = usePathname();

  const handleStatusUpdate = async (newStatusLower: string) => {
    const enumStatus = STATUS_MAP[newStatusLower as keyof typeof STATUS_MAP];
    if (!enumStatus) {
      toast.error("Invalid status");
      return;
    }
    if (!row.original.id) {
      toast.error("Order ID is missing");
      return;
    }

    toast.promise(
      updateOrderStatus(
        row.original.id.toString(),
        enumStatus,
        pathname as string,
      ),
      {
        loading: "Updating order status...",
        success: "Order status updated successfully",
        error: "Failed to update order status",
      },
    );
  };

  const handleDelete = async () => {
    if (!row.original.id) {
      toast.error("Order ID is missing");
      return;
    }

    toast.promise(deleteOrder(row.original.id.toString(), pathname as string), {
      loading: "Deleting order...",
      success: () => {
        setIsDeleteOpen(false);
        return "Order deleted successfully!";
      },
      error: "Failed to delete order",
    });
  };

  const handleCopy = () => {
    const { customerName, shippingAddress, customerPhone, items } =
      row.original;
    const first = items?.[0];
    const price = first ? first.unitPrice : 0;

    const formattedText = `${customerName}
${shippingAddress}
${customerPhone}
${row.original.total}/=`;

    navigator.clipboard
      .writeText(formattedText)
      .then(() => toast.success("Copied Successfully."))
      .catch(() => toast.error("There was an error"));
  };

  const firstItem = row.original.items?.[0];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => handleCopy()}
            className="flex items-center gap-2"
          >
            <ClipboardListIcon className="h-4 w-4" />
            <span>Copy Info</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsViewOpen(true)}>
            View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            className="text-red-500 focus:text-red-500"
          >
            Delete Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Order Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-auto p-0 md:min-w-3xl">
          <DialogHeader className="bg-background sticky top-0 z-10 border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold">
                  Order Details
                </DialogTitle>
                <DialogDescription>
                  Order No: {row.original.orderNo}
                </DialogDescription>
              </div>
              <Badge
                variant="outline"
                className={`px-3 py-1 text-sm font-medium capitalize ${getStatusColorClass(row.original.status)}`}
              >
                {row.original.status.toLowerCase()}
              </Badge>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-4">
            <div className="grid gap-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <IconUser className="text-muted-foreground h-5 w-5" />
                  <h3 className="text-lg font-medium">Customer Information</h3>
                </div>
                <div className="grid gap-3 rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <IconUser className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">{row.original.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconPhone className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">
                      <Link href={`tel:${row.original.customerPhone}`}>
                        {row.original.customerPhone}
                      </Link>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconMapPin className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">
                      {row.original.shippingAddress}
                    </span>
                  </div>
                  {/* Optional email, if you add it later */}
                  {/* row.original.email && ( ... ) */}

                  {row.original.referral && (
                    <div className="flex items-center gap-2">
                      <HandHelpingIcon className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm">{row.original.referral}</span>
                    </div>
                  )}

                  {/* orderNote can be included in your select if desired */}
                </div>
              </div>

              <Separator />

              {/* Order Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <IconPackage className="text-muted-foreground h-5 w-5" />
                  <h3 className="text-lg font-medium">Order Information</h3>
                </div>
                <div className="grid gap-3 rounded-lg border p-4">
                  {firstItem ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Product</span>
                        <span className="text-sm">{firstItem.title}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Quantity</span>
                        <span className="text-sm">{firstItem.qty}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Unit Price</span>
                        <span className="text-sm">{firstItem.unitPrice}৳</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total</span>
                        <span className="text-sm font-semibold">
                          {row.original.total}৳
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-red-500">No items</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Order Timeline */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <IconCalendar className="text-muted-foreground h-5 w-5" />
                  <h3 className="text-lg font-medium">Order Timeline</h3>
                </div>
                <div className="grid gap-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Order Date</span>
                    <span className="text-sm">
                      {format(new Date(row.original.createdAt), "PPP")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Updated</span>
                    <span className="text-sm">
                      {format(new Date(row.original.updatedAt), "PPP")}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Status Update & Admin */}
              <div className="flex justify-between">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Update Status</h3>
                  <Select
                    defaultValue={row.original.status.toLowerCase()}
                    onValueChange={handleStatusUpdate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Admin</h3>
                  <h4 className="max-w-36 truncate text-center text-sm font-medium">
                    {row.original.statusUpdatedBy?.name?.trim() || "-"}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background sticky bottom-0 border-t px-6 py-4">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete order {row.original.orderNo}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
