export const getCustomerOrderReport = cache(async () => {
  try {
    await dbConnect();

    // Authentication and authorization
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;

    if (!email) {
      throw new Error("Only authenticated users can access their orders");
    }

    // Get all orders for the customer
    const orders = await Order.find({ email });

    // Calculate statistics
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(
      (order) => order.status === "delivered" || order.status === "confirmed",
    ).length;
    const cancelledOrders = orders.filter(
      (order) => order.status === "cancelled",
    ).length;
    const ongoingOrders = orders.filter(
      (order) =>
        order.status !== "delivered" &&
        order.status !== "confirmed" &&
        order.status !== "cancelled",
    ).length;

    return {
      totalOrders,
      deliveredOrders,
      ongoingOrders,
      cancelledOrders,
    };
  } catch (error) {
    logger.error("Error fetching order report:", error);
    throw new Error("Failed to fetch customer order report");
  }
});
