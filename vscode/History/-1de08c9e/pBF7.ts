"use server";

import Blog from "@/models/blog.model";
import Order from "@/models/order.model";
import Product from "@/models/product.model";
import { auth, currentUser } from "@clerk/nextjs/server";
import { PipelineStage } from "mongoose";
import { cache } from "react";
import dbConnect from "../db-connect";
import logger from "../logger";

// Get total revenue stats
export async function getRevenueStats() {
  try {
    await dbConnect();

    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;
    if (role !== "admin") {
      throw new Error("Access denied: only admin can perform this action.");
    }

    // Get the current date and calculate the start of the last 6 months
    const currentDate = new Date();
    const sixMonthsAgo = new Date(currentDate);
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // Pipeline to calculate monthly revenue
    const monthlyRevenuePipeline = [
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $in: ["delivered", "confirmed"] },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $project: {
          month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: {
            $multiply: [
              { $ifNull: ["$quantity", 1] }, // Order quantity
              {
                $multiply: [
                  { $ifNull: ["$productDetails.salePrice", 0] }, // Product price
                  {
                    $subtract: [
                      1,
                      {
                        $divide: [
                          { $ifNull: ["$productDetails.discount", 0] },
                          100,
                        ],
                      }, // Discount as fraction
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$month",
          totalRevenue: { $sum: "$revenue" },
        },
      },
      {
        $sort: { _id: 1 as const },
      },
    ];

    // Pipeline to calculate total revenue
    const totalRevenuePipeline = [
      {
        $match: { status: { $in: ["delivered", "confirmed"] } },
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $project: {
          revenue: {
            $multiply: [
              { $ifNull: ["$quantity", 1] }, // Order quantity
              {
                $multiply: [
                  { $ifNull: ["$productDetails.salePrice", 0] }, // Product price
                  {
                    $subtract: [
                      1,
                      {
                        $divide: [
                          { $ifNull: ["$productDetails.discount", 0] },
                          100,
                        ],
                      }, // Discount as fraction
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$revenue" },
        },
      },
    ];

    const [monthlyRevenue, totalRevenueResult] = await Promise.all([
      Order.aggregate(monthlyRevenuePipeline),
      Order.aggregate(totalRevenuePipeline),
    ]);

    const totalRevenue = totalRevenueResult[0]?.totalRevenue.toFixed(2) || 0;

    let response = {
      totalRevenue,
      growthRate: 0,
      trend: "No data",
    };

    if (monthlyRevenue.length >= 2) {
      const latestMonth = monthlyRevenue[monthlyRevenue.length - 1];
      const previousMonth = monthlyRevenue[monthlyRevenue.length - 2];

      const growthRate =
        previousMonth.totalRevenue === 0
          ? latestMonth.totalRevenue > 0
            ? 100
            : 0
          : ((latestMonth.totalRevenue - previousMonth.totalRevenue) /
              previousMonth.totalRevenue) *
            100;

      response = {
        totalRevenue,
        growthRate: Math.abs(Number(growthRate.toFixed(2))),
        trend:
          growthRate > 0
            ? "Trending up"
            : growthRate < 0
              ? "Trending down"
              : "Stable",
      };
    }

    return response;
  } catch (error) {
    logger.error("Error getting revenue stats:", error);
    throw error;
  }
}

// Get total products stats
export async function getProductsStats() {
  try {
    await dbConnect();

    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;
    if (role !== "admin") {
      throw new Error("Access denied: only admin can perform this action.");
    }

    const currentDate = new Date();
    const sixMonthsAgo = new Date(currentDate);
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyProductsPipeline = [
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          productCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 as const },
      },
    ];

    const totalProductsPipeline = [
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
        },
      },
    ];

    const [monthlyProducts, totalProductsResult] = await Promise.all([
      Product.aggregate(monthlyProductsPipeline),
      Product.aggregate(totalProductsPipeline),
    ]);

    const totalProducts = totalProductsResult[0]?.totalProducts || 0;

    let response = {
      totalProducts,
      growthRate: 0,
      trend: "No data",
    };

    if (monthlyProducts.length >= 2) {
      const latestMonth = monthlyProducts[monthlyProducts.length - 1];
      const previousMonth = monthlyProducts[monthlyProducts.length - 2];

      const growthRate =
        previousMonth.productCount === 0
          ? latestMonth.productCount > 0
            ? 100
            : 0
          : ((latestMonth.productCount - previousMonth.productCount) /
              previousMonth.productCount) *
            100;

      response = {
        totalProducts,
        growthRate: Math.abs(Number(growthRate.toFixed(2))),
        trend: growthRate > 0 ? "Up" : growthRate < 0 ? "Down" : "Stable",
      };
    }

    return response;
  } catch (error) {
    logger.error("Error getting products stats:", error);
    throw error;
  }
}

// Get total orders stats
export async function getOrdersStats() {
  try {
    await dbConnect();

    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;
    if (role !== "admin") {
      throw new Error("Access denied: only admin can perform this action.");
    }

    const currentDate = new Date();
    const sixMonthsAgo = new Date(currentDate);
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyOrdersPipeline = [
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 as const },
      },
    ];

    const totalOrdersPipeline = [
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
        },
      },
    ];

    const [monthlyOrders, totalOrdersResult] = await Promise.all([
      Order.aggregate(monthlyOrdersPipeline),
      Order.aggregate(totalOrdersPipeline),
    ]);

    const totalOrders = totalOrdersResult[0]?.totalOrders || 0;

    let response = {
      totalOrders,
      growthRate: 0,
      trend: "No data",
    };

    if (monthlyOrders.length >= 2) {
      const latestMonth = monthlyOrders[monthlyOrders.length - 1];
      const previousMonth = monthlyOrders[monthlyOrders.length - 2];

      const growthRate =
        previousMonth.orderCount === 0
          ? latestMonth.orderCount > 0
            ? 100
            : 0
          : ((latestMonth.orderCount - previousMonth.orderCount) /
              previousMonth.orderCount) *
            100;

      response = {
        totalOrders,
        growthRate: Math.abs(Number(growthRate.toFixed(2))),
        trend: growthRate > 0 ? "Strong order growth" : "Order decline",
      };
    }

    return response;
  } catch (error) {
    logger.error("Error getting orders stats:", error);
    throw error;
  }
}

// Get total blogs stats
export async function getBlogsStats() {
  try {
    await dbConnect();

    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;
    if (role !== "admin") {
      throw new Error("Access denied: only admin can perform this action.");
    }

    const currentDate = new Date();
    const sixMonthsAgo = new Date(currentDate);
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyBlogsPipeline = [
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          blogCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 as const },
      },
    ];

    const totalBlogsPipeline = [
      {
        $group: {
          _id: null,
          totalBlogs: { $sum: 1 },
        },
      },
    ];

    const [monthlyBlogs, totalBlogsResult] = await Promise.all([
      Blog.aggregate(monthlyBlogsPipeline),
      Blog.aggregate(totalBlogsPipeline),
    ]);

    const totalBlogs = totalBlogsResult[0]?.totalBlogs || 0;

    let response = {
      totalBlogs,
      growthRate: 0,
      trend: "No data",
    };

    if (monthlyBlogs.length >= 2) {
      const latestMonth = monthlyBlogs[monthlyBlogs.length - 1];
      const previousMonth = monthlyBlogs[monthlyBlogs.length - 2];

      const growthRate =
        previousMonth.blogCount === 0
          ? latestMonth.blogCount > 0
            ? 100
            : 0
          : ((latestMonth.blogCount - previousMonth.blogCount) /
              previousMonth.blogCount) *
            100;

      response = {
        totalBlogs,
        growthRate: Math.abs(Number(growthRate.toFixed(2))),
        trend: growthRate > 0 ? "Content growing" : "Content decline",
      };
    }

    return response;
  } catch (error) {
    logger.error("Error getting blogs stats:", error);
    throw error;
  }
}

// Get overall growth rate
export async function getGrowthRate() {
  try {
    await dbConnect();

    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;
    if (role !== "admin") {
      throw new Error("Access denied: only admin can perform this action.");
    }

    // Calculate growth rates for different metrics
    const [revenueStats, productsStats, ordersStats, blogsStats] =
      await Promise.all([
        getRevenueStats(),
        getProductsStats(),
        getOrdersStats(),
        getBlogsStats(),
      ]);

    // Calculate average growth rate
    const growthRates = [
      Number(revenueStats.growthRate),
      Number(productsStats.growthRate),
      Number(ordersStats.growthRate),
      Number(blogsStats.growthRate),
    ].filter((rate) => !isNaN(rate));

    const averageGrowthRate =
      growthRates.length > 0
        ? growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length
        : 0;

    return {
      growthRate: Number(averageGrowthRate.toFixed(2)),
      trend: averageGrowthRate > 0 ? "increase" : "decrease",
    };
  } catch (error) {
    logger.error("Error getting growth rate:", error);
    throw error;
  }
}

// Get selling report data
// Last 3 months daily report: orders (any), sales (any), completed (confirmed|delivered), revenue (confirmed|delivered)
export async function getSellingReport() {
  try {
    await dbConnect();

    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;
    if (role !== "admin") {
      throw new Error("Access denied: only admin can perform this action.");
    }

    const currentDate = new Date();
    const threeMonthsAgo = new Date(currentDate);
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

    const startStr = threeMonthsAgo.toISOString().split("T")[0]; // yyyy-mm-dd
    const endStr = currentDate.toISOString().split("T")[0];

    const [res] = await Order.aggregate([
      // derive dateOnly once
      {
        $addFields: {
          dateOnly: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
        },
      },
      // filter by date window only (no status filter here)
      {
        $match: {
          dateOnly: { $gte: startStr, $lte: endStr },
        },
      },
      {
        $facet: {
          /* A) Any status -> orders & sales */
          anyStatus: [
            {
              $group: {
                _id: "$dateOnly",
                // number of orders (any status)
                orderCount: { $sum: 1 },
                // items sold = sum of quantity (any status)
                salesCount: { $sum: { $ifNull: ["$quantity", 1] } },
              },
            },
            { $sort: { _id: 1 } },
          ],

          /* B) confirmed|delivered -> completed & revenue */
          completedRevenue: [
            { $match: { status: { $in: ["confirmed", "delivered"] } } },
            {
              $lookup: {
                from: "products",
                localField: "product",
                foreignField: "_id",
                as: "productDetails",
              },
            },
            {
              $unwind: {
                path: "$productDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: "$dateOnly",
                // completed = confirmed OR delivered count
                completedCount: { $sum: 1 },
                // revenue from confirmed|delivered
                totalRevenue: {
                  $sum: {
                    $multiply: [
                      { $ifNull: ["$quantity", 1] },
                      { $ifNull: ["$productDetails.salePrice", 0] },
                    ],
                  },
                },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ]);

    const anyStatus =
      (res?.anyStatus as Array<{
        _id: string;
        orderCount: number;
        salesCount: number;
      }>) ?? [];
    const completedRevenue =
      (res?.completedRevenue as Array<{
        _id: string;
        completedCount: number;
        totalRevenue: number;
      }>) ?? [];

    // merge by date
    const byDate = new Map<
      string,
      { order: number; sales: number; completed: number; revenue: number }
    >();

    for (const d of anyStatus) {
      byDate.set(d._id, {
        order: d.orderCount,
        sales: d.salesCount, // ✅ any status
        completed: 0,
        revenue: 0,
      });
    }

    for (const d of completedRevenue) {
      const prev = byDate.get(d._id) ?? {
        order: 0,
        sales: 0,
        completed: 0,
        revenue: 0,
      };
      byDate.set(d._id, {
        order: prev.order,
        sales: prev.sales,
        completed: d.completedCount, // ✅ confirmed|delivered
        revenue: d.totalRevenue, // ✅ confirmed|delivered revenue
      });
    }

    const chartData = Array.from(byDate.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([date, v]) => ({
        date,
        order: v.order,
        sales: v.sales, // any status
        completed: v.completed, // confirmed|delivered
        revenue: v.revenue, // confirmed|delivered
      }));

    return chartData;
  } catch (error) {
    logger.error("Error getting selling report:", error);
    throw error;
  }
}

// Get customer stats data
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

export async function getMonthlyRevenueLastYear() {
  try {
    await dbConnect();

    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;

    if (role !== "admin") {
      throw new Error("Access denied: only admin can view monthly revenue.");
    }

    // Get current date and one year ago
    const currentDate = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
    oneYearAgo.setHours(0, 0, 0, 0);

    const monthlyRevenuePipeline: PipelineStage[] = [
      {
        $match: {
          createdAt: { $gte: oneYearAgo },
          status: { $in: ["delivered", "confirmed"] },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $project: {
          month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: {
            $multiply: [
              { $ifNull: ["$quantity", 1] },
              {
                $multiply: [
                  { $ifNull: ["$productDetails.salePrice", 0] },
                  {
                    $subtract: [
                      1,
                      {
                        $divide: [
                          { $ifNull: ["$productDetails.discount", 0] },
                          100,
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$month",
          totalRevenue: { $sum: "$revenue" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];

    const revenueData = await Order.aggregate(monthlyRevenuePipeline);

    // Format for frontend chart
    const formattedData = revenueData.map((item) => ({
      month: item._id,
      revenue: parseFloat(item.totalRevenue.toFixed(2)),
    }));

    return formattedData;
  } catch (error) {
    logger.error("Error in getMonthlyRevenueLastYear:", error);
    throw error;
  }
}

export async function getReferralDistribution() {
  try {
    await dbConnect();

    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;
    if (role !== "admin") {
      throw new Error("Access denied");
    }

    const referralPipeline: PipelineStage[] = [
      {
        $match: {
          status: { $in: ["delivered", "confirmed"] },
        },
      },
      {
        $group: {
          _id: "$referral",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: { $ifNull: ["$_id", "unknown"] }, // handle null
          value: "$count",
        },
      },
      {
        $sort: { value: -1 },
      },
    ];

    const result = await Order.aggregate(referralPipeline);

    return result;
  } catch (error) {
    logger.error("Error in getReferralDistribution:", error);
    throw error;
  }
}
