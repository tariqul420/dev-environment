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
      todayStats,
      weeklyStats,
      monthlyStats,
    ] = await Promise.all([
      // Today's stats
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
          status: { in: [OrderStatus.DELIVERED, OrderStatus.CONFIRMED] },
        },
        _count: { _all: true },
        _sum: { total: true },
      }),
      
      // Weekly stats
      prisma.order.aggregate({
        where: {
          createdAt: { gte: weekStart },
          status: { in: [OrderStatus.DELIVERED, OrderStatus.CONFIRMED] },
        },
        _count: { _all: true },
        _sum: { total: true },
      }),
      
      // Monthly stats
      prisma.order.aggregate({
        where: {
          createdAt: { gte: monthStart },
          status: { in: [OrderStatus.DELIVERED, OrderStatus.CONFIRMED] },
        },
        _count: { _all: true },
        _sum: { total: true },
      }),
    ]);

    // Calculate processing rate (completed vs total orders this month)
    const monthlyTotalOrders = await prisma.order.count({
      where: { createdAt: { gte: monthStart } },
    });

    const orderProcessingRate = monthlyTotalOrders > 0 
      ? Math.round((monthlyStats._count._all / monthlyTotalOrders) * 100)
      : 100;

    // Mock customer satisfaction (can be implemented with actual feedback system)
    const customerSatisfaction = 92;

    return {
      todayOrders: todayStats._count._all,
      weeklyOrders: weeklyStats._count._all,
      monthlyOrders: monthlyStats._count._all,
      todayRevenue: Number(todayStats._sum.total || 0),
      weeklyRevenue: Number(weeklyStats._sum.total || 0),
      monthlyRevenue: Number(monthlyStats._sum.total || 0),
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