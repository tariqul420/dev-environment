"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  type OrderCreateInput,
  OrderCreateSchema,
} from "@/lib/validators/order";
import logger from "../logger";
import { requiredAdminOrStaff, requiredUser, userId } from "../utils/auth";
import {
  endOfDay,
  generateOrderNo,
  normalizeOrderStatus,
  normalizeStatuses,
  SENTINELS,
  toDec,
} from "../utils/order";

export async function createOrder(input: unknown) {
  try {
    const data: OrderCreateInput = OrderCreateSchema.parse(input);
    const id = await userId();

    const productIds = data.items.map((i) => i.productId);

    const created = await prisma.$transaction(async (tx) => {
      const locked = await tx.$queryRaw<
        Array<{ id: string; title: string; price: number; stock: number }>
      >`
        SELECT id, title, price, stock
        FROM "Product"
        WHERE id = ANY(${productIds}) AND status = 'ACTIVE'
        FOR UPDATE
      `;

      if (locked.length !== productIds.length) {
        const found = new Set(locked.map((p) => p.id));
        const missing = productIds.filter((pid) => !found.has(pid));
        throw new Error(
          `Some products are not available: ${missing.join(", ")}`,
        );
      }

      let subtotalNum = 0;
      const itemRows = data.items.map((it) => {
        const p = locked.find((x) => x.id === it.productId);
        if (!p) {
          throw new Error(`Product not found for ${it.productId}`);
        }
        if (p.stock < it.quantity) {
          throw new Error(`Insufficient stock for ${p.title}`);
        }
        const unit = Number(p.price);
        const line = unit * it.quantity;
        subtotalNum += line;
        return {
          productId: p.id,
          title: p.title,
          qty: it.quantity,
          unitPrice: toDec(unit),
          total: toDec(line),
        };
      });

      for (const it of data.items) {
        const updated = await tx.$executeRaw`
          UPDATE "Product" SET stock = stock - ${it.quantity} WHERE id = ${it.productId} AND stock >= ${it.quantity}
        `;
        if (updated !== 1) {
          const p = locked.find((x) => x.id === it.productId);
          if (!p) {
            throw new Error(`Product not found for ${it.productId}`);
          }
          throw new Error(`Insufficient stock for ${p.title}`);
        }
      }

      const shippingNum = 0;
      const totalNum = subtotalNum + shippingNum;

      const orderNo = await generateOrderNo(tx as TxWithOrderCount);

      const order = await tx.order.create({
        data: {
          orderNo,
          userId: id,
          customerName: data.customer.customerName,
          customerPhone: data.customer.customerPhone,
          shippingAddress: data.customer.shippingAddress,
          orderNote: data.customer.orderNote,
          referral: data.referral,
          source: data.mode === "direct" ? "DIRECT" : "CART",
          status: "PENDING",
          paymentMethod: data.paymentMethod,
          currency: "BDT",
          subtotal: toDec(subtotalNum),
          shippingTotal: toDec(shippingNum),
          total: toDec(totalNum),
          items: { createMany: { data: itemRows } },
        },
        select: { orderNo: true, customerPhone: true },
      });

      return order;
    });

    globalThis.io?.emit("new-order");

    return { orderNo: created.orderNo, phone: created.customerPhone };
  } catch (error) {
    logger.error(
      "Failed to create order: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to create order", { cause: error });
  }
}

export async function getOrdersForAdmin({
  page = 1,
  limit = 25,
  search = "",
  dateFrom,
  dateTo,
  adminId,
  status,
  sortBy = "createdAt",
  sortDir = "desc",
}: OrdersAdminParams) {
  try {
    await requiredAdminOrStaff();

    const currentPage = Math.max(1, Math.floor(page));
    const perPage = Math.min(100, Math.max(1, Math.floor(limit)));
    const skip = (currentPage - 1) * perPage;

    const statuses = normalizeStatuses(status);

    const gte = dateFrom ? new Date(dateFrom) : undefined;
    const lte = dateTo ? endOfDay(new Date(dateTo)) : undefined;

    const adminIdTrim =
      typeof adminId === "string" ? adminId.trim() : undefined;
    const hasAdminFilter = !!(adminIdTrim && !SENTINELS.has(adminIdTrim));

    const where: Prisma.OrderWhereInput = {
      ...(search && {
        OR: [
          { customerName: { contains: search, mode: "insensitive" } },
          { customerPhone: { contains: search, mode: "insensitive" } },
          { orderNo: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(gte || lte
        ? { createdAt: { ...(gte && { gte }), ...(lte && { lte }) } }
        : {}),
      ...(hasAdminFilter && { statusUpdatedById: adminIdTrim }),
      ...(statuses && { status: { in: statuses } }),
    };

    const baseOrderBy: Prisma.OrderOrderByWithRelationInput =
      sortBy === "admin"
        ? { createdAt: sortDir === "asc" ? "asc" : "desc" }
        : { [sortBy]: sortDir };

    const [ordersRaw, total, statusGroups, adminIdsDistinct] =
      await Promise.all([
        prisma.order.findMany({
          where,
          select: {
            id: true,
            orderNo: true,
            userId: true,
            sessionId: true,
            customerName: true,
            customerPhone: true,
            shippingAddress: true,
            orderNote: true,
            referral: true,
            source: true,
            status: true,
            paymentMethod: true,
            currency: true,
            subtotal: true,
            shippingTotal: true,
            total: true,
            statusUpdatedById: true,
            statusUpdatedAt: true,
            createdAt: true,
            updatedAt: true,
            items: {
              select: {
                id: true,
                productId: true,
                title: true,
                qty: true,
                unitPrice: true,
                total: true,
                product: {
                  select: {
                    images: {
                      select: { url: true, alt: true, sort: true },
                      orderBy: { sort: "asc" },
                      take: 1,
                    },
                  },
                },
              },
            },
            statusUpdatedBy: {
              select: { id: true, name: true },
            },
          },
          orderBy: baseOrderBy,
          skip,
          take: perPage,
        }),
        prisma.order.count({ where }),
        prisma.order.groupBy({
          where,
          by: ["status"],
          _count: { _all: true },
        }),
        prisma.order.findMany({
          where,
          select: { statusUpdatedById: true },
          distinct: ["statusUpdatedById"],
        }),
      ]);

    let orders = ordersRaw;
    if (sortBy === "admin") {
      const dir = sortDir === "asc" ? 1 : -1;
      orders = [...ordersRaw].sort((a, b) => {
        const aName = (a.statusUpdatedBy?.name ?? "").trim();
        const bName = (b.statusUpdatedBy?.name ?? "").trim();
        return aName.localeCompare(bName) * dir;
      });
    }

    const statusHistoryCount = (
      statusGroups as Array<{ status: string; _count: { _all: number } }>
    ).reduce<Record<string, number>>((acc, g) => {
      acc[g.status] = g._count._all;
      return acc;
    }, {});

    const adminIds = Array.from(
      new Set(
        adminIdsDistinct
          .map((r) => r.statusUpdatedById)
          .filter((v): v is string => !!v),
      ),
    );
    const admins = adminIds.length
      ? await prisma.user.findMany({
          where: { id: { in: adminIds } },
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        })
      : [];

    const totalPages = Math.ceil(total / perPage);

    return JSON.parse(
      JSON.stringify({
        orders,
        pagination: {
          currentPage,
          totalPages,
          totalItems: total,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        },
        statusHistoryCount,
        admins: admins.map((a) => ({
          id: a.id,
          name: a.name ?? "",
        })),
      }),
    );
  } catch (error) {
    console.error("Failed to fetch orders for admin:", error);
    throw new Error("Failed to fetch orders for admin");
  }
}

export async function updateOrderStatus(
  orderId: string,
  nextStatus: string,
  pathToRevalidate?: string,
) {
  try {
    await requiredAdminOrStaff();
    const uid = await userId();

    const status = normalizeOrderStatus(nextStatus);

    const updated = await prisma.$transaction(async (tx) => {
      const prev = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          status: true,
          items: { select: { productId: true, qty: true } },
        },
      });

      if (!prev) throw new Error("Order not found");

      const res = await tx.order.update({
        where: { id: orderId },
        data: {
          status,
          statusUpdatedById: uid,
          statusUpdatedAt: new Date(),
        },
        select: {
          id: true,
          orderNo: true,
          status: true,
          statusUpdatedById: true,
          statusUpdatedAt: true,
          updatedAt: true,
        },
      });

      if (prev.status !== "CANCELLED" && status === "CANCELLED") {
        for (const it of prev.items) {
          if (!it.productId || !Number.isFinite(it.qty)) continue;
          await tx.product.update({
            where: { id: it.productId },
            data: { stock: { increment: it.qty } },
          });
        }
      }

      return res;
    });

    const io = globalThis.io;
    if (io) {
      io.emit("update-order-status");
    }

    if (pathToRevalidate) {
      revalidatePath(pathToRevalidate);
    }

    return updated;
  } catch (error) {
    logger.error(
      `Error updating order status for order ID ${orderId}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    throw new Error("Error updating order status. Please try again.", {
      cause: error,
    });
  }
}

export async function deleteOrder(orderId: string, pathToRevalidate?: string) {
  await requiredAdminOrStaff();

  try {
    const deleted = await prisma.order.delete({
      where: { id: orderId },
      select: { id: true, orderNo: true },
    });

    const io = globalThis.io;
    if (io) {
      io.emit("delete-order");
    }

    if (pathToRevalidate) revalidatePath(pathToRevalidate);

    return { success: true, deleted };
  } catch (error) {
    logger.error(
      `Error deleting order with ID ${orderId}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    throw new Error("Error deleting order. Please try again.", {
      cause: error,
    });
  }
}

export async function deleteOrders(ids: string[]): Promise<void> {
  try {
    await requiredAdminOrStaff();

    const deleted = await prisma.order.deleteMany({
      where: { id: { in: ids } },
    });

    if (deleted.count === 0) {
      throw new Error("No orders were deleted");
    }

    const io = globalThis.io;
    if (io) {
      io.emit("delete-orders");
    }

    revalidatePath("/admin/orders");
  } catch (error) {
    logger.error(
      "Failed to delete orders: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to delete orders", { cause: error });
  }
}

export async function getOrderReceipt(phone: string, orderNo: string) {
  const order = await prisma.order.findFirst({
    where: {
      orderNo,
      customerPhone: phone,
    },
    select: {
      id: true,
      orderNo: true,
      status: true,
      paymentMethod: true,
      source: true,
      currency: true,
      subtotal: true,
      shippingTotal: true,
      total: true,
      customerName: true,
      customerPhone: true,
      shippingAddress: true,
      orderNote: true,
      referral: true,
      createdAt: true,
      updatedAt: true,
      items: {
        select: {
          id: true,
          title: true,
          qty: true,
          unitPrice: true,
          total: true,
          product: {
            select: {
              packageDuration: true,
              images: { take: 1, select: { url: true } },
            },
          },
        },
        orderBy: { id: "asc" },
      },
      statusUpdatedBy: { select: { id: true, name: true } },
      statusUpdatedAt: true,
    },
  });

  return order;
}

export async function getOrdersForCustomer({
  page = 1,
  limit = 25,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  try {
    await requiredUser();
    const id = await userId();

    const currentPage = Math.max(1, Math.floor(page));
    const perPage = Math.min(100, Math.max(1, Math.floor(limit)));
    const skip = (currentPage - 1) * perPage;

    const where: Prisma.OrderWhereInput = {
      userId: id,
      ...(search && {
        OR: [
          { customerName: { contains: search, mode: "insensitive" } },
          { customerPhone: { contains: search, mode: "insensitive" } },
          { orderNo: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        select: {
          id: true,
          orderNo: true,
          customerName: true,
          customerPhone: true,
          shippingAddress: true,
          orderNote: true,
          status: true,
          paymentMethod: true,
          currency: true,
          subtotal: true,
          shippingTotal: true,
          total: true,
          statusUpdatedAt: true,
          createdAt: true,
          updatedAt: true,
          items: {
            select: {
              id: true,
              productId: true,
              title: true,
              qty: true,
              unitPrice: true,
              total: true,
              product: {
                select: {
                  images: {
                    select: { url: true, alt: true, sort: true },
                    orderBy: { sort: "asc" },
                    take: 1,
                  },
                },
              },
            },
            orderBy: { id: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: perPage,
      }),
      prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(total / perPage);

    return JSON.parse(
      JSON.stringify({
        orders,
        pagination: {
          currentPage,
          totalPages,
          totalItems: total,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        },
      }),
    );
  } catch (error) {
    logger.error(
      "Failed to fetch order for customer: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to fetch order for customer", { cause: error });
  }
}
