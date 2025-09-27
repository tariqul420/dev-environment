"use server";

import { OrderStatus } from "@prisma/client";
import { cache } from "react";
import logger from "../logger";
import { prisma } from "../prisma";
import { requiredUser, userId } from "../utils/auth";

export async function getCustomerOrdersReport() {
  try {
    await requiredUser();
    const id = await userId();

    if (!id) {
      throw new Error("User ID not found");
    }

    // Get all orders for the customer
    const orders = await prisma.order.findMany({
      where: { userId: id },
      select: { status: true },
    });

    // Calculate statistics
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(
      (order) =>
        order.status === OrderStatus.DELIVERED ||
        order.status === OrderStatus.CONFIRMED,
    ).length;
    const cancelledOrders = orders.filter(
      (order) => order.status === OrderStatus.CANCELLED,
    ).length;
    const ongoingOrders = orders.filter(
      (order) =>
        order.status !== OrderStatus.DELIVERED &&
        order.status !== OrderStatus.CONFIRMED &&
        order.status !== OrderStatus.CANCELLED,
    ).length;

    return {
      totalOrders,
      deliveredOrders,
      ongoingOrders,
      cancelledOrders,
    };
  } catch (error) {
    logger.error(
      "Error fetching customer order report: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to fetch customer order report");
  }
}
