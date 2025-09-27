import { prisma } from "../prisma";
import { userId } from "../utils/auth";

export const getCustomerOrderReport = cache(async () => {
  try {
    await requireCustomer();
    const id = await userId();

    // Get all orders for the customer
    const orders = await prisma.order.findMany({ where: { user.id: id } });

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
