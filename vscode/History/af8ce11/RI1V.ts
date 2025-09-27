"use server";

import { currentUser } from "@clerk/nextjs/server";
import { OrderStatus, Prisma } from "@prisma/client";
import { subDays, subHours } from "date-fns";
import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "../utils/auth";

// Type definitions for Prisma groupBy results
type OrderItemGroupByResult = {
  productId: string;
  _sum: {
    qty: number | null;
    total: Prisma.Decimal | null;
  };
};

type OrderGroupByResult = {
  paymentMethod: string;
  _count: {
    _all: number;
  };
  _sum: {
    total: Prisma.Decimal | null;
  };
};

type ProductWithImages = {
  id: string;
  title: string;
  stock: number;
  price: Prisma.Decimal;
  compareAtPrice: Prisma.Decimal | null;
  images: Array<{ url: string }>;
};

const COMPLETED_STATUSES: OrderStatus[] = [
  OrderStatus.DELIVERED,
  OrderStatus.CONFIRMED,
];

const COMPLETED_STATUS_ARRAY = Prisma.sql`
  ARRAY[${Prisma.join(
    COMPLETED_STATUSES.map((s) => Prisma.sql`${s}::"OrderStatus"`),
  )}]::"OrderStatus"[]
`;

const monthKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

// const dayKey = (d: Date) =>
//   `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
//     d.getDate(),
//   ).padStart(2, "0")}`;

function lastNMonthKeys(n: number, from = new Date()): string[] {
  const keys: string[] = [];
  const cursor = new Date(from);
  cursor.setDate(1);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(cursor);
    d.setMonth(cursor.getMonth() - i);
    keys.push(monthKey(d));
  }
  return keys;
}

function padMonthly(
  rows: { month: string; value: number }[],
  nMonths: number,
  from = new Date(),
) {
  const frame = lastNMonthKeys(nMonths, from);
  const map = new Map(rows.map((r) => [r.month, r.value]));
  return frame.map((m) => ({ month: m, value: map.get(m) ?? 0 }));
}

const calcGrowth = (latest: number, prev: number) =>
  prev === 0 ? (latest > 0 ? 100 : 0) : ((latest - prev) / prev) * 100;

type MonthRow = { month: string; value: number };

export async function getRevenueStats() {
  try {
    await requireAdmin();

    const totalAgg = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: COMPLETED_STATUSES } },
    });
    const totalRevenue = Number(totalAgg._sum.total ?? 0).toFixed(2);

    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const rows = await prisma.$queryRaw<MonthRow[]>`
      SELECT
        to_char(date_trunc('month', "createdAt"), 'YYYY-MM') AS month,
        COALESCE(SUM("total"), 0)::numeric::float8 AS value
      FROM "Order"
      WHERE "createdAt" >= ${sixMonthsAgo}
        AND "status" = ANY(${COMPLETED_STATUS_ARRAY})
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    const monthlyPadded = padMonthly(rows, 7, now);
    let growthRate = 0;
    let trend: "No data" | "Trending up" | "Trending down" | "Stable" =
      "No data";

    if (monthlyPadded.length >= 2) {
      const latest = monthlyPadded[monthlyPadded.length - 1].value;
      const prev = monthlyPadded[monthlyPadded.length - 2].value;
      const g = calcGrowth(latest, prev);
      growthRate = Math.abs(Number(g.toFixed(2)));
      trend = g > 0 ? "Trending up" : g < 0 ? "Trending down" : "Stable";
    }

    return {
      totalRevenue,
      growthRate,
      trend,
      monthlyRevenue: monthlyPadded.map((r) => ({
        month: r.month,
        totalRevenue: Number(r.value.toFixed(2)),
      })),
    };
  } catch (error) {
    logger.error(
      "Error getting revenue stats: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to get revenue stats", { cause: error });
  }
}

export async function getProductsStats() {
  try {
    await requireAdmin();

    const totalProducts = await prisma.product.count();

    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const rows = await prisma.$queryRaw<MonthRow[]>`
      SELECT
        to_char(date_trunc('month', "createdAt"), 'YYYY-MM') AS month,
        COUNT(*)::int AS value
      FROM "Product"
      WHERE "createdAt" >= ${sixMonthsAgo}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    const monthlyPadded = padMonthly(rows, 7, now);

    let growthRate = 0;
    let trend: "No data" | "Up" | "Down" | "Stable" = "No data";
    if (monthlyPadded.length >= 2) {
      const latest = monthlyPadded[monthlyPadded.length - 1].value;
      const prev = monthlyPadded[monthlyPadded.length - 2].value;
      const g = calcGrowth(latest, prev);
      growthRate = Math.abs(Number(g.toFixed(2)));
      trend = g > 0 ? "Up" : g < 0 ? "Down" : "Stable";
    }

    return {
      totalProducts,
      growthRate,
      trend,
      monthlyProducts: monthlyPadded.map((r) => ({
        month: r.month,
        productCount: r.value,
      })),
    };
  } catch (error) {
    logger.error(
      "Error getting products stats: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to get products stats", { cause: error });
  }
}

export async function getOrdersStats() {
  try {
    await requireAdmin();

    const totalOrders = await prisma.order.count();

    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const rows = await prisma.$queryRaw<MonthRow[]>`
      SELECT
        to_char(date_trunc('month', "createdAt"), 'YYYY-MM') AS month,
        COUNT(*)::int AS value
      FROM "Order"
      WHERE "createdAt" >= ${sixMonthsAgo}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    const monthlyPadded = padMonthly(rows, 7, now);

    let growthRate = 0;
    let trend: "No data" | "Strong order growth" | "Order decline" | "Stable" =
      "No data";

    if (monthlyPadded.length >= 2) {
      const latest = monthlyPadded[monthlyPadded.length - 1].value;
      const prev = monthlyPadded[monthlyPadded.length - 2].value;
      const g = calcGrowth(latest, prev);
      growthRate = Math.abs(Number(g.toFixed(2)));
      trend =
        g > 0 ? "Strong order growth" : g < 0 ? "Order decline" : "Stable";
    }

    return {
      totalOrders,
      growthRate,
      trend,
      monthlyOrders: monthlyPadded.map((r) => ({
        month: r.month,
        orderCount: r.value,
      })),
    };
  } catch (error) {
    logger.error(
      "Error getting orders stats: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to get orders stats", { cause: error });
  }
}

export async function getBlogsStats() {
  try {
    await requireAdmin();

    const totalBlogs = await prisma.blog.count();

    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const rows = await prisma.$queryRaw<MonthRow[]>`
      SELECT
        to_char(date_trunc('month', "createdAt"), 'YYYY-MM') AS month,
        COUNT(*)::int AS value
      FROM "Blog"
      WHERE "createdAt" >= ${sixMonthsAgo}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    const monthlyPadded = padMonthly(rows, 7, now);

    let growthRate = 0;
    let trend: "No data" | "Content growing" | "Content decline" | "Stable" =
      "No data";

    if (monthlyPadded.length >= 2) {
      const latest = monthlyPadded[monthlyPadded.length - 1].value;
      const prev = monthlyPadded[monthlyPadded.length - 2].value;
      const g = calcGrowth(latest, prev);
      growthRate = Math.abs(Number(g.toFixed(2)));
      trend = g > 0 ? "Content growing" : g < 0 ? "Content decline" : "Stable";
    }

    return {
      totalBlogs,
      growthRate,
      trend,
      monthlyBlogs: monthlyPadded.map((r) => ({
        month: r.month,
        blogCount: r.value,
      })),
    };
  } catch (error) {
    logger.error(
      "Error getting blogs stats: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to get blogs stats", { cause: error });
  }
}

export async function getGrowthRate() {
  try {
    await requireAdmin();

    const [revenue, products, orders, blogs] = await Promise.all([
      getRevenueStats(),
      getProductsStats(),
      getOrdersStats(),
      getBlogsStats(),
    ]);

    const rates = [
      Number(revenue.growthRate),
      Number(products.growthRate),
      Number(orders.growthRate),
      Number(blogs.growthRate),
    ].filter((n) => !Number.isNaN(n));

    const avg =
      rates.length > 0 ? rates.reduce((a, b) => a + b, 0) / rates.length : 0;

    return {
      growthRate: Number(avg.toFixed(2)),
      trend: avg > 0 ? "increase" : avg < 0 ? "decrease" : "stable",
    };
  } catch (error) {
    logger.error(
      "Error getting growth rate: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to get growth rate", { cause: error });
  }
}

export async function getSellingReport(monthsBack = 3) {
  try {
    await requireAdmin();

    const end = new Date();
    const start = new Date(end);
    start.setMonth(end.getMonth() - monthsBack);
    start.setHours(0, 0, 0, 0);

    const rows = await prisma.$queryRaw<
      {
        date: string;
        orders: number;
        completed: number;
        sales: number;
        revenue: number;
      }[]
    >`
      WITH days AS (
        SELECT
          to_char(date_trunc('day', o."createdAt"), 'YYYY-MM-DD') AS date,
          COUNT(*)::int AS orders,
          SUM(CASE WHEN o."status" = ANY(${COMPLETED_STATUS_ARRAY}) THEN 1 ELSE 0 END)::int AS completed,
          COALESCE(SUM(CASE WHEN o."status" = ANY(${COMPLETED_STATUS_ARRAY}) THEN o."total" ELSE 0 END), 0)::numeric::float8 AS revenue
        FROM "Order" o
        WHERE o."createdAt" >= ${start} AND o."createdAt" <= ${end}
        GROUP BY 1
      ),
      items AS (
        SELECT
          to_char(date_trunc('day', o."createdAt"), 'YYYY-MM-DD') AS date,
          COALESCE(SUM(oi."qty"), 0)::int AS sales
        FROM "Order" o
        JOIN "OrderItem" oi ON oi."orderId" = o."id"
        WHERE o."createdAt" >= ${start} AND o."createdAt" <= ${end}
          AND o."status" = ANY(${COMPLETED_STATUS_ARRAY})
        GROUP BY 1
      )
      SELECT d.date, d.orders, d.completed, COALESCE(i.sales, 0) AS sales, d.revenue
      FROM days d
      LEFT JOIN items i ON i.date = d.date
      ORDER BY d.date ASC
    `;

    return rows.map((r) => ({
      date: r.date,
      orders: r.orders,
      completed: r.completed,
      sales: r.sales,
      revenue: Number(r.revenue.toFixed(2)),
    }));
  } catch (error) {
    logger.error(
      "Error getting selling report: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to get selling report", { cause: error });
  }
}

export const getCustomerOrderReport = async () => {
  try {
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) {
      throw new Error("Only authenticated users can access their orders");
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      select: { status: true },
    });

    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((o) =>
      (
        [OrderStatus.DELIVERED, OrderStatus.CONFIRMED] as OrderStatus[]
      ).includes(o.status),
    ).length;
    const cancelledOrders = orders.filter(
      (o) => o.status === OrderStatus.CANCELLED,
    ).length;
    const ongoingOrders = totalOrders - deliveredOrders - cancelledOrders;

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
};

export async function getMonthlyRevenueLastYear() {
  try {
    await requireAdmin();

    const now = new Date();
    const yearAgo = new Date(now);
    yearAgo.setFullYear(now.getFullYear() - 1);
    yearAgo.setHours(0, 0, 0, 0);

    const rows = await prisma.$queryRaw<MonthRow[]>`
      SELECT
        to_char(date_trunc('month', "createdAt"), 'YYYY-MM') AS month,
        COALESCE(SUM("total"), 0)::numeric::float8 AS value
      FROM "Order"
      WHERE "createdAt" >= ${yearAgo}
        AND "status" = ANY(${COMPLETED_STATUS_ARRAY})
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    const monthlyPadded = padMonthly(rows, 12 + 1, now);
    return monthlyPadded.map((r) => ({
      month: r.month,
      revenue: Number(r.value.toFixed(2)),
    }));
  } catch (error) {
    logger.error(
      "Error in getMonthlyRevenueLastYear: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to get monthly revenue", { cause: error });
  }
}

export async function getReferralDistribution() {
  try {
    await requireAdmin();

    const rows = await prisma.$queryRaw<{ name: string; value: number }[]>`
      SELECT
        COALESCE("referral", 'unknown') AS name,
        COUNT(*)::int AS value
      FROM "Order"
      WHERE "status" = ANY(${COMPLETED_STATUS_ARRAY})
      GROUP BY 1
      ORDER BY value DESC
    `;

    return rows;
  } catch (error) {
    logger.error(
      "Error in getReferralDistribution: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to get referral distribution", { cause: error });
  }
}

export async function getLowStockProducts(params?: {
  threshold?: number;
  limit?: number;
}) {
  try {
    await requireAdmin();

    const threshold = params?.threshold ?? 5;
    const limit = params?.limit ?? 10;

    const products = await prisma.product.findMany({
      where: { status: "ACTIVE", stock: { lt: threshold } },
      orderBy: [{ stock: "asc" }, { updatedAt: "desc" }],
      take: limit,
      select: {
        id: true,
        title: true,
        stock: true,
        price: true,
        compareAtPrice: true,
      },
    });

    // Get first image for each product separately to avoid type issues
    const productsWithImages = await Promise.all(
      products.map(async (p) => {
        const firstImage = await prisma.productImage.findFirst({
          where: { productId: p.id },
          select: { url: true },
          orderBy: { sort: "asc" },
        });
        
        return {
          id: p.id,
          title: p.title,   
          stock: p.stock,
          price: p.price?.toString(),
          compareAtPrice: p.compareAtPrice?.toString(),
          image: firstImage?.url ?? null,
        };
      })
    );

    return productsWithImages;
  } catch (error) {
    logger.error(
      "Error getting low stock products: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to get low stock products", { cause: error });
  }
}export async function getTrendingProducts(params?: {
  rangeDays?: number;
  limit?: number;
}) {
  try {
    await requireAdmin();

    const rangeDays = params?.rangeDays ?? 30;
    const limit = params?.limit ?? 9;
    const since = subDays(new Date(), rangeDays);

    const grouped = await prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        order: {
          createdAt: { gte: since },
          status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
        },
      },
      _sum: { qty: true, total: true },
      orderBy: { _sum: { qty: "desc" } },
      take: limit * 2,
    }) as OrderItemGroupByResult[];

    const productIds = grouped.map((g) => g.productId);
    if (productIds.length === 0) return [];

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        title: true,
        price: true,
        compareAtPrice: true,
        images: { select: { url: true }, orderBy: { sort: "asc" }, take: 1 },
      },
    });

    const byId = new Map(products.map((p) => [p.id, p]));
    
    type TrendingProduct = {
      id: string;
      title: string;
      image: string | null;
      price: string | undefined;
      compareAtPrice: string | undefined;
      soldQty: number;
      revenue: string;
    };

    return grouped
      .map((g) => {
        const p = byId.get(g.productId);
        if (!p) return null;
        return {
          id: p.id,
          title: p.title,
          image: p.images[0]?.url ?? null,
          price: p.price?.toString(),
          compareAtPrice: p.compareAtPrice?.toString(),
          soldQty: g._sum.qty ?? 0,
          revenue: (g._sum.total ?? 0).toString(),
        };
      })
      .filter((item): item is TrendingProduct => item !== null)
      .slice(0, limit);
  } catch (error) {
    logger.error(
      "Error getting trending products: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to get trending products", { cause: error });
  }
}

export async function getPaymentMix(params?: { rangeDays?: number }) {
  try {
    await requireAdmin();

    const rangeDays = params?.rangeDays ?? 30;
    const since = subDays(new Date(), rangeDays);

    const grouped = await prisma.order.groupBy({
      by: ["paymentMethod"],
      where: {
        createdAt: { gte: since },
        status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
      },
      _count: { _all: true },
      _sum: { total: true },
    }) as OrderGroupByResult[];

    const tot = grouped.reduce((a, g) => a + (g._count._all ?? 0), 0);
    return grouped
      .map((g) => ({
        method: g.paymentMethod,
        orders: g._count._all ?? 0,
        amount: g._sum.total?.toString() ?? "0",
        sharePct: tot ? Math.round(((g._count._all ?? 0) / tot) * 100) : 0,
      }))
      .sort((a, b) => b.orders - a.orders);
  } catch (error) {
    logger.error(
      "Error getting payment mix: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to get payment mix", { cause: error });
  }
}

export async function getAbandonedCarts(params?: {
  inactiveHours?: number;
  rangeDays?: number;
  limit?: number;
}) {
  const inactiveHours = params?.inactiveHours ?? 12;
  const rangeDays = params?.rangeDays ?? 7;
  const limit = params?.limit ?? 10;

  const recentSince = subDays(new Date(), rangeDays);
  const inactiveBefore = subHours(new Date(), inactiveHours);

  const carts = await prisma.cart.findMany({
    where: {
      updatedAt: { gte: recentSince, lte: inactiveBefore },
      items: { some: {} },
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      updatedAt: true,
      items: {
        select: {
          qty: true,
          unitPrice: true,
          product: {
            select: {
              id: true,
              title: true,
              images: {
                take: 1,
                orderBy: { sort: "asc" },
                select: { url: true },
              },
            },
          },
        },
      },
    },
  });

  const rows = carts.map((c) => {
    const value = c.items.reduce(
      (acc, it) => acc + Number(it.unitPrice) * it.qty,
      0,
    );
    const top = c.items[0]?.product;
    return {
      cartId: c.id,
      updatedAt: c.updatedAt.toISOString(),
      value,
      itemCount: c.items.reduce((a, it) => a + it.qty, 0),
      sampleProduct: top
        ? { id: top.id, title: top.title, image: top.images[0]?.url ?? null }
        : null,
    };
  });

  const summary = {
    count: rows.length,
    avgValue: rows.length
      ? Math.round(rows.reduce((a, r) => a + r.value, 0) / rows.length)
      : 0,
  };

  return { summary, rows };
}
