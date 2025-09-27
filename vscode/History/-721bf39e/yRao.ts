"use server";

import { OrderStatus } from "@prisma/client";
import { startOfDay, startOfWeek, startOfMonth, endOfDay } from "date-fns";
import logger from "../logger";
import { prisma } from "../prisma";
import { requiredAdminOrStaff } from "../utils/auth";

// Get staff dashboard statistics
export async function getStaffStats() {
  try {
    await requiredAdminOrStaff();

    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      todayOrders,
      totalCustomers,
    ] = await Promise.all([
      // Total orders
      prisma.order.count(),
      
      // Pending orders
      prisma.order.count({
        where: { status: OrderStatus.PENDING },
      }),
      
      // Processing orders
      prisma.order.count({
        where: { 
          status: { 
            in: [OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.SHIPPED] 
          } 
        },
      }),
      
      // Delivered orders
      prisma.order.count({
        where: { 
          status: { 
            in: [OrderStatus.DELIVERED, OrderStatus.CONFIRMED] 
          } 
        },
      }),
      
      // Today's orders
      prisma.order.count({
        where: {
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),
      
      // Total customers
      prisma.user.count({
        where: { role: "USER" },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      todayOrders,
      totalCustomers,
      monthlyRevenue: 0, // Can be implemented later
    };
  } catch (error) {
    logger.error(
      "Error fetching staff stats: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to fetch staff stats");
  }
}

// Get recent orders for staff dashboard
export async function getStaffRecentOrders(limit = 10) {
  try {
    await requiredAdminOrStaff();

    const recentOrders = await prisma.order.findMany({
      select: {
        id: true,
        orderNo: true,
        customerName: true,
        customerPhone: true,
        status: true,
        total: true,
        createdAt: true,
        items: {
          select: {
            title: true,
            qty: true,
          },
          take: 3, // First 3 items
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return recentOrders;
  } catch (error) {
    logger.error(
      "Error fetching staff recent orders: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to fetch staff recent orders");
  }
}

// Get staff performance data
export async function getStaffPerformance() {
  try {
    await requiredAdminOrStaff();

    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);

    const [
      todayOrders,
      weeklyOrders, 
      monthlyOrders,
      todayRevenue,
      weeklyRevenue,
      monthlyRevenue,
      monthlyTotalOrders,
    ] = await Promise.all([
      // Today's orders count
      prisma.order.count({
        where: {
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
          status: { in: [OrderStatus.DELIVERED, OrderStatus.CONFIRMED] },
        },
      }),
      
      // Weekly orders count
      prisma.order.count({
        where: {
          createdAt: { gte: weekStart },
          status: { in: [OrderStatus.DELIVERED, OrderStatus.CONFIRMED] },
        },
      }),
      
      // Monthly orders count
      prisma.order.count({
        where: {
          createdAt: { gte: monthStart },
          status: { in: [OrderStatus.DELIVERED, OrderStatus.CONFIRMED] },
        },
      }),

      // Today's revenue
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
          status: { in: [OrderStatus.DELIVERED, OrderStatus.CONFIRMED] },
        },
        _sum: { total: true },
      }).then(result => Number(result._sum.total || 0)),
      
      // Weekly revenue
      prisma.order.aggregate({
        where: {
          createdAt: { gte: weekStart },
          status: { in: [OrderStatus.DELIVERED, OrderStatus.CONFIRMED] },
        },
        _sum: { total: true },
      }).then(result => Number(result._sum.total || 0)),
      
      // Monthly revenue
      prisma.order.aggregate({
        where: {
          createdAt: { gte: monthStart },
          status: { in: [OrderStatus.DELIVERED, OrderStatus.CONFIRMED] },
        },
        _sum: { total: true },
      }).then(result => Number(result._sum.total || 0)),

      // Total orders this month for processing rate calculation
      prisma.order.count({
        where: { createdAt: { gte: monthStart } },
      }),
    ]);

    // Calculate processing rate (completed vs total orders this month)
    const orderProcessingRate = monthlyTotalOrders > 0 
      ? Math.round((monthlyOrders / monthlyTotalOrders) * 100)
      : 100;

    // Mock customer satisfaction (can be implemented with actual feedback system)
    const customerSatisfaction = 92;

    return {
      todayOrders,
      weeklyOrders,
      monthlyOrders,
      todayRevenue,
      weeklyRevenue,
      monthlyRevenue,
      orderProcessingRate,
      customerSatisfaction,
    };
  } catch (error) {
    logger.error(
      "Error fetching staff performance: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to fetch staff performance");
  }
}