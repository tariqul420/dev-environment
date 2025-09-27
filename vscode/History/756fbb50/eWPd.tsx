"use client";

import { IconDotsVertical } from "@tabler/icons-react";
import { Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";

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
import { OrderRecord } from "@/types/table-columns";
import {
  IconCalendar,
  IconMapPin,
  IconPackage,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import { HandHelpingIcon, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

interface AdminOrderTableMenuProps {
  row: Row<OrderRecord>;
}

export default function AdminOrderTableMenu({ row }: AdminOrderTableMenuProps) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const pathname = usePathname();

  const handleStatusUpdate = async (newStatus: string) => {
    if (!row.original._id) {
      toast.error("Order ID is missing");
      return;
    }

    toast.promise(
      updateOrderStatus(row.original._id.toString(), newStatus, pathname),
      {
        loading: "Updating order status...",
        success: "Order status updated successfully",
        error: "Failed to update order status",
      },
    );
  };

  const handleDelete = async () => {
    if (!row.original._id) {
      toast.error("Order ID is missing");
      return;
    }

    toast.promise(deleteOrder(row.original._id.toString(), pathname), {
      loading: "Deleting order...",
      success: () => {
        setIsDeleteOpen(false);
        return "Order deleted successfully!";
      },
      error: "Failed to delete order",
    });
  };

  const handelCopy = () => {
    const formattedText = `
    ${row.original.name}
    ${row.original.address}
    ${row.original.phone}
    ${row.original.product?.salePrice}/=
    `;

    navigator.clipboard
      .writeText(formattedText)
      .then(() => {
        toast.success("Copied Successfully.");
      })
      .catch(() => {
        toast.error("There have an error");
      });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handelCopy()}>
            Copy Info
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
                  Order ID: {row.original.orderId}
                </DialogDescription>
              </div>
              <Badge
                variant="outline"
                className={`px-3 py-1 text-sm font-medium capitalize ${getStatusColorClass(
                  row.original.status,
                )}`}
              >
                {row.original.status}
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
                    <span className="text-sm">{row.original.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconPhone className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">{row.original.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconMapPin className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">{row.original.address}</span>
                  </div>
                  {row.original.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm">{row.original.email}</span>
                    </div>
                  )}

                  {row.original.referral && (
                    <div className="flex items-center gap-2">
                      <HandHelpingIcon className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm">{row.original.referral}</span>
                    </div>
                  )}

                  {row.original.orderNote && (
                    <div>
                      <span className="text-sm">{row.original.orderNote}</span>
                    </div>
                  )}
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
                  {row.original.product ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Product</span>
                        <span className="text-sm">
                          {row.original.product.title}{" "}
                          {row.original.product.packageDuration &&
                            `(${row.original.product.packageDuration})`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Quantity</span>
                        <span className="text-sm">{row.original.quantity}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Unit Price</span>
                        <span className="text-sm">
                          {row.original.product.salePrice}৳
                        </span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total</span>
                        <span className="text-sm font-semibold">
                          {row.original.quantity *
                            row.original.product.salePrice}
                          ৳
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-red-500">
                      Product has been deleted
                    </p>
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

              {/* Status Update */}
              <div className="flex justify-between">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Update Status</h3>
                  <Select
                    defaultValue={row.original.status}
                    onValueChange={handleStatusUpdate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Admin */}
                <div>
                  <h3 className="text-lg font-medium">Admin</h3>
                  <h4 className="max-w-36 truncate text-center text-sm font-medium">
                    {row.original.admin
                      ? `${row.original.admin.firstName} ${row.original.admin.lastName}`
                      : `-`}
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
              Are you sure you want to delete order {row.original.orderId}? This
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
