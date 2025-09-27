"use server";

import { cache } from "react";
import { OrderStatus } from "@prisma/client";
import logger from "../logger";
import { prisma } from "../prisma";
import { requiredUser, userId } from "../utils/auth";

export const getCustomerOrderReport = cache(async () => {
  try {
    await requiredUser();
    const id = await userId();

    if (!id) {
      throw new Error("User ID not found");
    }

    // Get all orders for the customer
    const orders = await prisma.order.findMany({ 
      where: { userId: id },
      select: { status: true }
    });

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
