export default function serviceStatus({ status }) {
  const handleStatusUpdate = async (newStatus) => {
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
  return <div>service-status</div>;
}
