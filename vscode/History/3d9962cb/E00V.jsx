import { Select } from "@/components/ui/select";
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

  return <Select></Select>;
}
