"use server";

import { OrderStatus } from "@prisma/client";
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

// Get customer spending summary
export async function getCustomerSpendingSummary() {
  try {
    await requiredUser();
    const id = await userId();

    if (!id) {
      throw new Error("User ID not found");
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: id,
        status: {
          in: [OrderStatus.DELIVERED, OrderStatus.CONFIRMED],
        },
      },
      select: {
        total: true,
        createdAt: true,
      },
    });

    const totalSpent = orders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );
    const averageOrderValue =
      orders.length > 0 ? totalSpent / orders.length : 0;

    // Calculate this month's spending
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthOrders = orders.filter(
      (order) => order.createdAt >= startOfMonth,
    );
    const thisMonthSpent = thisMonthOrders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );

    return {
      totalSpent,
      averageOrderValue,
      thisMonthSpent,
      totalCompletedOrders: orders.length,
    };
  } catch (error) {
    logger.error(
      "Error fetching customer spending summary: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to fetch customer spending summary");
  }
}

// Get customer recent orders (last 5)
export async function getCustomerRecentOrders() {
  try {
    await requiredUser();
    const id = await userId();

    if (!id) {
      throw new Error("User ID not found");
    }

    const recentOrders = await prisma.order.findMany({
      where: { userId: id },
      select: {
        id: true,
        orderNo: true,
        status: true,
        total: true,
        createdAt: true,
        items: {
          select: {
            title: true,
            qty: true,
          },
          take: 2, // First 2 items to show
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return recentOrders;
  } catch (error) {
    logger.error(
      "Error fetching customer recent orders: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to fetch customer recent orders");
  }
}

// Get recommended products based on customer's order history
export async function getRecommendedProducts() {
  try {
    await requiredUser();
    const id = await userId();

    if (!id) {
      throw new Error("User ID not found");
    }

    // First, try to get products based on customer's purchase history
    try {
      // Get product IDs from customer's completed orders
      const purchasedProductIds = await prisma.orderItem.findMany({
        where: {
          order: {
            userId: id,
            status: {
              in: [OrderStatus.DELIVERED, OrderStatus.CONFIRMED],
            },
          },
        },
        select: {
          productId: true,
        },
        distinct: ['productId'],
      });

      const productIds = purchasedProductIds.map((item) => item.productId);

      if (productIds.length > 0) {
        // Get categories of purchased products
        const purchasedProducts = await prisma.product.findMany({
          where: {
            id: { in: productIds },
          },
          include: {
            categories: {
              select: {
                categoryId: true,
              },
            },
          },
        });

        const categoryIds = [
          ...new Set(
            purchasedProducts
              .flatMap((product) => product.categories)
              .map((cat) => cat.categoryId)
          ),
        ];

        // Get recommended products from same categories (excluding already purchased)
        if (categoryIds.length > 0) {
          const recommendedProducts = await prisma.product.findMany({
            where: {
              status: "ACTIVE",
              id: { notIn: productIds },
              categories: {
                some: {
                  categoryId: { in: categoryIds },
                },
              },
            },
            select: {
              id: true,
              title: true,
              price: true,
              compareAtPrice: true,
              images: {
                select: {
                  url: true,
                  alt: true,
                },
                take: 1,
                orderBy: { sort: "asc" },
              },
            },
            take: 6,
            orderBy: { createdAt: "desc" },
          });

          if (recommendedProducts.length > 0) {
            return recommendedProducts;
          }
        }
      }
    } catch {
      // If personalized recommendations fail, fall back to popular products
      logger.error("Error getting personalized recommendations, falling back to popular products");
    }

    // Fallback: Return popular/latest products
    const popularProducts = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        title: true,
        price: true,
        compareAtPrice: true,
        images: {
          select: {
            url: true,
            alt: true,
          },
          take: 1,
          orderBy: { sort: "asc" },
        },
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    return popularProducts;
  } catch (error) {
    logger.error(
      "Error fetching recommended products: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to fetch recommended products");
  }
}
