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
import {
  ClipboardListIcon,
  CreditCard,
  HandHelpingIcon,
  Receipt,
} from "lucide-react";
import Image from "next/image";
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
import getStatusIcon, {
  getStatusColorClass,
  getStatusLabel,
} from "@/lib/utils/status";

// Keep your row type
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

const currencySymbol = (c?: string) => (c === "BDT" ? "৳" : "");

const fmt = (v: number | string) => {
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n.toLocaleString("en-BD") : String(v ?? "");
};

export default function AdminOrderTableMenu({ row }: AdminOrderTableMenuProps) {
  const o = row.original;
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const pathname = usePathname();
  const sym = currencySymbol(o.currency);

  const handleStatusUpdate = async (newStatusLower: string) => {
    const enumStatus = STATUS_MAP[newStatusLower as keyof typeof STATUS_MAP];
    if (!enumStatus) {
      toast.error("Invalid status");
      return;
    }
    if (!o.id) {
      toast.error("Order ID is missing");
      return;
    }

    toast.promise(updateOrderStatus(o.id.toString(), enumStatus, pathname), {
      loading: "Updating order status...",
      success: "Order status updated",
      error: "Failed to update order status",
    });
  };

  const handleDelete = async () => {
    if (!o.id) {
      toast.error("Order ID is missing");
      return;
    }

    toast.promise(deleteOrder(o.id.toString(), pathname), {
      loading: "Deleting order...",
      success: () => {
        setIsDeleteOpen(false);
        return "Order deleted successfully!";
      },
      error: "Failed to delete order",
    });
  };

  const handleCopy = () => {
    const itemsLines = o.items?.length
      ? o.items
          .map(
            (it, i) =>
              `${i + 1}. ${it.title} — ${it.qty} × ${fmt(it.unitPrice)}${sym} = ${fmt(
                it.total,
              )}${sym}`,
          )
          .join("\n")
      : "No items";

    const text = `Order No: ${o.orderNo}
Customer: ${o.customerName}
Phone: ${o.customerPhone}
Address: ${o.shippingAddress}
${o.referral ? `Referral: ${o.referral}\n` : ""}${
  o.orderNote ? `Note: ${o.orderNote}\n` : ""
}Payment: ${o.paymentMethod}
Source: ${o.source}
Currency: ${o.currency}

Items:
${itemsLines}

Subtotal: ${fmt(o.subtotal)}${sym}
Shipping: ${fmt(o.shippingTotal)}${sym}
Total: ${fmt(o.total)}${sym}`;

    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied invoice to clipboard."))
      .catch(() => toast.error("Copy failed"));
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
          <DropdownMenuItem
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            <ClipboardListIcon className="h-4 w-4" />
            <span>Copy Invoice</span>
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
        <DialogContent className="max-h-[90vh] w-[min(96vw,900px)] overflow-auto p-0">
          {/* Header */}
          <DialogHeader className="bg-background sticky top-0 z-10 border-b px-6 py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-xl font-semibold">
                  Order Details
                </DialogTitle>
                <DialogDescription>Order No: {o.orderNo}</DialogDescription>
                <div className="flex flex-wrap gap-2">
                  {/* Status */}
                  <Badge
                    variant="outline"
                    className={`gap-1 px-2 capitalize ${getStatusColorClass(o.status)}`}
                    title={getStatusLabel(o.status)}
                  >
                    {getStatusIcon(o.status)}
                    {getStatusLabel(o.status)}
                  </Badge>
                  {/* Payment */}
                  <Badge variant="secondary" className="gap-1 px-2">
                    <CreditCard className="h-3.5 w-3.5" />
                    {o.paymentMethod}
                  </Badge>
                  {/* Source */}
                  <Badge variant="secondary" className="px-2">
                    {o.source}
                  </Badge>
                  {/* Currency */}
                  <Badge variant="secondary" className="px-2">
                    {o.currency}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Receipt className="mr-2 h-4 w-4" />
                  Copy Invoice
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Body */}
          <div className="px-6 py-5">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Customer */}
              <section className="lg:col-span-1 space-y-4">
                <div className="flex items-center gap-2">
                  <IconUser className="text-muted-foreground h-5 w-5" />
                  <h3 className="text-lg font-medium">Customer</h3>
                </div>
                <div className="grid gap-3 rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <IconUser className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">{o.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconPhone className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">
                      <Link href={`tel:${o.customerPhone}`}>
                        {o.customerPhone}
                      </Link>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconMapPin className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">{o.shippingAddress}</span>
                  </div>
                  {o.referral && (
                    <div className="flex items-center gap-2">
                      <HandHelpingIcon className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm">{o.referral}</span>
                    </div>
                  )}
                  {o.orderNote && (
                    <div className="rounded-md bg-muted/40 p-2 text-xs">
                      {o.orderNote}
                    </div>
                  )}
                </div>

                <div className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <IconCalendar className="text-muted-foreground h-5 w-5" />
                    <h3 className="text-lg font-medium">Timeline</h3>
                  </div>
                  <dl className="grid gap-2 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">Order Date</dt>
                      <dd>{format(new Date(o.createdAt), "PPP")}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">Last Updated</dt>
                      <dd>{format(new Date(o.updatedAt), "PPP")}</dd>
                    </div>
                    {o.statusUpdatedAt && (
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-muted-foreground">
                          Status Updated
                        </dt>
                        <dd>{format(new Date(o.statusUpdatedAt), "PPP")}</dd>
                      </div>
                    )}
                    {o.statusUpdatedBy?.name && (
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-muted-foreground">By</dt>
                        <dd className="truncate">{o.statusUpdatedBy.name}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </section>

              {/* Items & totals */}
              <section className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <IconPackage className="text-muted-foreground h-5 w-5" />
                  <h3 className="text-lg font-medium">Items</h3>
                </div>

                <div className="rounded-lg border">
                  <div className="grid grid-cols-12 gap-3 border-b px-4 py-2 text-xs text-muted-foreground">
                    <div className="col-span-7">Product</div>
                    <div className="col-span-2 text-right">Qty</div>
                    <div className="col-span-1 text-right">Price</div>
                    <div className="col-span-2 text-right">Line Total</div>
                  </div>

                  {o.items?.length ? (
                    o.items.map((it, idx) => {
                      // optional thumbnail from product.images[0] or flattened image
                      const thumb =
                        (it as any).image?.url ??
                        (it as any).product?.images?.[0]?.url ??
                        null;

                      return (
                        <div
                          key={it.id ?? idx}
                          className="grid grid-cols-12 items-center gap-3 px-4 py-3"
                        >
                          <div className="col-span-7 flex items-center gap-3">
                            <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                              {thumb ? (
                                <Image
                                  src={thumb}
                                  alt={it.title}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium">
                                {it.title}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2 text-right text-sm">
                            {it.qty}
                          </div>
                          <div className="col-span-1 text-right text-sm">
                            {fmt(it.unitPrice)}
                            {sym}
                          </div>
                          <div className="col-span-2 text-right text-sm font-medium">
                            {fmt(it.total)}
                            {sym}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      No items
                    </div>
                  )}
                </div>

                <div className="ml-auto w-full max-w-sm space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                      {fmt(o.subtotal)}
                      {sym}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {fmt(o.shippingTotal)}
                      {sym}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>
                      {fmt(o.total)}
                      {sym}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-background sticky bottom-0 border-t px-6 py-4">
            <div className="flex justify-end gap-2">
              <Select
                defaultValue={o.status.toLowerCase()}
                onValueChange={handleStatusUpdate}
              >
                <SelectTrigger className="w-[180px]">
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
              Are you sure you want to delete order {o.orderNo}? This action
              cannot be undone.
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
