"use server";

import Order from "@/models/order.model";
import Product from "@/models/product.model";
import { GetOrdersForAdminParams, IOrder } from "@/types/order";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import dbConnect from "../db-connect";
import logger from "../logger";
import { objectId } from "../utils";
import User from "@/models/user.model";
import mongoose from "mongoose";

// create a new order
export async function createOrder(orderData: IOrder) {
  try {
    await dbConnect();

    // Validate product and quantity
    const product = await Product.findById(orderData.product);
    if (!product || orderData.quantity <= 0) {
      throw new Error("Invalid product or quantity");
    }

    // Find the last order to generate new orderId
    const lastOrder = await Order.findOne({}, {}, { sort: { orderId: -1 } });
    let newOrderNumber = 1;

    if (lastOrder && lastOrder.orderId) {
      const lastNumber = parseInt(lastOrder.orderId.replace("#", ""));
      newOrderNumber = lastNumber + 1;
    }

    const orderId = `#${String(newOrderNumber).padStart(Math.max(6, String(newOrderNumber).length), "0")}`;

    const newOrder = new Order({
      ...orderData,
      orderId,
    });

    const savedOrder = await newOrder.save();

    if (!savedOrder) {
      throw new Error("Failed to save order");
    }

    // Emit real-time order to socket clients (admin dashboard)
    const io = globalThis.io;
    if (io) {
      io.emit("new-order");
    }

    // Revalidate necessary tags
    revalidateTag("order");
    revalidateTag("admin-orders");
    revalidateTag("customer-orders");

    return JSON.parse(JSON.stringify(savedOrder));
  } catch (error) {
    const err = error as Error;
    throw new Error(
      err.message || "Something went wrong while creating the order.",
    );
  }
}

// get an existing order
export const getOrder = unstable_cache(
  async (phone: string, orderId: string) => {
    try {
      await dbConnect();

      const order = await Order.findOne({
        phone,
        orderId: `#${orderId}`,
      })
        .select("orderId name phone address createdAt quantity status product ")
        .populate("product", "title salePrice packageDuration")
        .lean();

      return order ? JSON.parse(JSON.stringify(order)) : null;
    } catch (error) {
      logger.error("Error fetching order by phone number and orderId:", error);
      throw error;
    }
  },
  ["getOrder"],
  { tags: ["order"] },
);

export const getOrdersForAdmin = async ({
  page = 1,
  limit = 20,
  search = "",
  dateFrom,
  dateTo,
  adminId,
  status,
  sortBy = "createdAt",
  sortDir = "desc",
}: GetOrdersForAdminParams) => {
  try {
    await dbConnect();

    // --- Auth ---
    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;
    if (role !== "admin") {
      throw new Error("Don't have permission to perform this action!");
    }

    // --- Normalizations ---
    const rx = search && { $regex: search, $options: "i" };

    const statuses = Array.isArray(status)
      ? status
      : typeof status === "string" && status.length
      ? status.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined;

    // Date range
    const createdAt: Record<string, Date> | undefined = (() => {
      if (!dateFrom && !dateTo) return undefined;
      const gte = dateFrom ? new Date(dateFrom) : undefined;
      const lte = dateTo
        ? new Date(
            typeof dateTo === "string"
              ? new Date(dateTo).setHours(23, 59, 59, 999)
              : (dateTo as Date).getTime()
          )
        : undefined;
      return {
        ...(gte && { $gte: gte }),
        ...(lte && { $lte: lte }),
      };
    })();

    // --- Admin handling ---
    const sentinelSet = new Set(["_all_", "__all__", "all", "ALL"]);
    const adminIdTrim = typeof adminId === "string" ? adminId.trim() : undefined;
    const hasAdminFilter = !!(adminIdTrim && !sentinelSet.has(adminIdTrim));
    const adminIdValid =
      hasAdminFilter && mongoose.Types.ObjectId.isValid(adminIdTrim!);

    // If adminId is present but invalid → return EMPTY result (no error)
    if (hasAdminFilter && !adminIdValid) {
      // Still compute admins list so UI filter থাকে।
      const adminIdsDistinct = await Order.distinct("admin", {
        ...(search && { $or: [{ name: rx }, { phone: rx }, { orderId: rx }, { email: rx }] }),
        ...(createdAt ? { createdAt } : {}),
        ...(statuses?.length ? { status: { $in: statuses } } : {}),
      });

      const admins =
        adminIdsDistinct.length > 0
          ? await User.find({ _id: { $in: adminIdsDistinct.filter(Boolean) } })
              .select("_id firstName lastName")
              .lean()
          : [];

      admins.sort((a, b) =>
        (`${a.firstName ?? ""} ${a.lastName ?? ""}`).localeCompare(
          `${b.firstName ?? ""} ${b.lastName ?? ""}`
        )
      );

      return JSON.parse(JSON.stringify({
        orders: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
        statusHistoryCount: {},
        admins: admins.map((a) => ({
          _id: a._id,
          firstName: a.firstName,
          lastName: a.lastName,
          fullName: `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim(),
        })),
      }));
    }

    // --- Build query (no admin filter if sentinel/_all_) ---
    const query: Record<string, unknown> = {
      ...(search && {
        $or: [{ name: rx }, { phone: rx }, { orderId: rx }, { email: rx }],
      }),
      ...(hasAdminFilter && adminIdValid
        ? { admin: new mongoose.Types.ObjectId(adminIdTrim!) }
        : {}), // no filter for _all_
      ...(statuses?.length ? { status: { $in: statuses } } : {}),
      ...(createdAt ? { createdAt } : {}),
    };

    // --- Sorting ---
    const sortStage: Record<string, 1 | -1> =
      sortBy === "admin"
        ? { createdAt: -1 } // We'll sort by admin name in-memory
        : { [sortBy]: sortDir === "asc" ? 1 : -1 };

    // --- Parallel queries ---
    const [ordersRaw, total, statusAgg, adminIdsDistinct] = await Promise.all([
      Order.find(query)
        .populate({
          path: "product",
          select: "title titleBengali salePrice packageDuration",
          options: { lean: true },
        })
        .populate({
          path: "admin",
          select: "firstName lastName",
          options: { lean: true, strictPopulate: false },
        })
        .select(
          "_id orderId name phone address status createdAt updatedAt quantity product email orderNote firstName lastName referral admin"
        )
        .sort(sortStage)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
      Order.aggregate([{ $match: query }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
      // Admin list for UI should ignore adminId filter so that "All admins" always shows full list
      Order.distinct("admin", {
        ...(search && { $or: [{ name: rx }, { phone: rx }, { orderId: rx }, { email: rx }] }),
        ...(createdAt ? { createdAt } : {}),
        ...(statuses?.length ? { status: { $in: statuses } } : {}),
      }),
    ]);

    // In-memory sort by admin name if requested
    let orders = ordersRaw;
    if (sortBy === "admin") {
      const dir = sortDir === "asc" ? 1 : -1;
      orders = [...ordersRaw].sort((a, b) => {
        const aName = (a.admin?.firstName ?? "") + " " + (a.admin?.lastName ?? "");
        const bName = (b.admin?.firstName ?? "") + " " + (b.admin?.lastName ?? "");
        return aName.localeCompare(bName) * dir;
      });
    }

    // Pagination
    const totalPages = Math.ceil(total / limit);

    // Status summary (remove zeros)
    const statusHistoryCount = statusAgg.reduce<Record<string, number>>((acc, row) => {
      if (row.count > 0 && row._id) acc[row._id] = row.count;
      return acc;
    }, {});

    // Admin options
    const admins =
      adminIdsDistinct.length > 0
        ? await User.find({ _id: { $in: adminIdsDistinct.filter(Boolean) } })
            .select("_id firstName lastName")
            .lean()
        : [];

    admins.sort((a, b) =>
      (`${a.firstName ?? ""} ${a.lastName ?? ""}`).localeCompare(`${b.firstName ?? ""} ${b.lastName ?? ""}`)
    );

    return JSON.parse(JSON.stringify({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      statusHistoryCount,
      admins: admins.map((a) => ({
        _id: a._id,
        firstName: a.firstName,
        lastName: a.lastName,
        fullName: `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim(),
      })),
    }))
  } catch (error) {
    logger.error("Error fetching orders:", error);
    // Real error → throw (invalid adminId path never throws)
    throw new Error("Failed to fetch orders");
  }
};


// update order status
export async function updateOrderStatus(
  orderId: string,
  status: string,
  path: string,
) {
  try {
    await dbConnect();

    // Authentication and authorization
    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;
    const userId = sessionClaims?.userId as string;

    if (role !== "admin") {
      throw new Error("Don't have permission to perform this action!");
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status, admin: objectId(userId) },
      { new: true },
    ).lean();

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    const io = globalThis.io;
    if (io) {
      io.emit("update-order-status");
    }

    revalidatePath(path);
    revalidateTag("order");
    revalidateTag("admin-orders");
    revalidateTag("customer-orders");

    return JSON.parse(JSON.stringify(updatedOrder));
  } catch (error) {
    logger.error("Error updating order status:", error);
    throw error;
  }
}

// delete order
export async function deleteOrder(orderId: string, path: string) {
  try {
    await dbConnect();

    // Authentication and authorization
    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;

    if (role !== "admin") {
      throw new Error("Don't have permission to perform this action!");
    }

    const deletedOrder = await Order.findByIdAndDelete(orderId).lean();

    if (!deletedOrder) {
      throw new Error("Order not found");
    }

    const io = globalThis.io;
    if (io) {
      io.emit("delete-order");
    }

    revalidatePath(path);
    revalidateTag("order");
    revalidateTag("admin-orders");
    revalidateTag("customer-orders");

    return JSON.parse(JSON.stringify(deletedOrder));
  } catch (error) {
    logger.error("Error deleting order:", error);
    throw error;
  }
}

// get all orders for customer
export const getOrdersForCustomer = async ({
  page = 1,
  limit = 20,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    await dbConnect();

    // Authentication and authorization
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;

    if (!email) {
      throw new Error("Only authenticated users can access their orders");
    }

    // Initialize query object
    const rx = search && { $regex: search, $options: "i" };
    const query = {
      email: email,
      ...(search && {
        $or: [{ name: rx }, { phone: rx }, { orderId: rx }],
      }),
    };

    // Execute query
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate({
          path: "product",
          select: "title titleBengali salePrice packageDuration",
          // Don't throw error if product is not found
          options: { lean: true },
        })
        .select(
          "_id orderId name phone address status createdAt updatedAt quantity product email orderNote",
        )
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      orders: JSON.parse(JSON.stringify(orders)),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    logger.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
};

// delete multiple orders
export const deleteOrders = async (ids: string[]) => {
  try {
    await dbConnect();

    // Authentication and authorization
    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;

    if (role !== "admin") {
      throw new Error("Don't have permission to perform this action!");
    }

    // Delete multiple orders
    const result = await Order.deleteMany({
      _id: { $in: ids },
    });

    if (result.deletedCount === 0) {
      throw new Error("No orders were deleted");
    }

    const io = globalThis.io;
    if (io) {
      io.emit("delete-orders");
    }

    // Revalidate the path to refresh the data
    revalidatePath("/admin/orders");
    revalidateTag("order");
    revalidateTag("admin-orders");
    revalidateTag("customer-orders");
  } catch (error) {
    logger.error("Error deleting orders:", error);
    throw new Error("Failed to delete orders");
  }
};
