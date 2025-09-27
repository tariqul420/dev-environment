"use client";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname } from "next/navigation";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "on-hold",
  "failed",
  "refunded",
  "unpaid",
  "paid",
];

export default function ServiceStatus({ id, status }) {
  const pathname = usePathname();

  const handleStatusUpdate = async (newStatus) => {
    if (!row.original._id) {
      toast.error("Service ID is missing");
      return;
    }

    toast.promise(updateOrderStatus(id, newStatus, pathname), {
      loading: "Updating order status...",
      success: "Order status updated successfully",
      error: "Failed to update order status",
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Update Status</h3>
      <Select defaultValue={status} onValueChange={handleStatusUpdate}>
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((s, idx) => (
            <SelectItem key={idx} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
