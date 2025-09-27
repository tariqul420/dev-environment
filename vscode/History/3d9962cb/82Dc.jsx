import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname } from "next/navigation";

export default function serviceStatus({ status }) {
  const pathname = usePathname();

  const handleStatusUpdate = async (newStatus) => {
    if (!row.original._id) {
      toast.error("Service ID is missing");
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Update Status</h3>
      <Select defaultValue={status} onValueChange={handleStatusUpdate}>
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
  );
}
