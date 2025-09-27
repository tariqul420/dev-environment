import { clerkClient } from "@clerk/nextjs/server";
import { OrderStatus, type Prisma, UserRole } from "@prisma/client";
import logger from "../logger";
import { prisma } from "../prisma";
import { requireAdmin } from "../utils/auth";

type AdminUserRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: "USER" | "STAFF" | "ADMIN";
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  totalOrders: number;
  completedOrders: number;
  totalSpent: string;
  lastOrderAt: Date | null;
  addressCount: number;
  hasDefaultAddress: boolean;
};

export async function getUsersForAdmin({
  page = 1,
  limit = 25,
  search = "",
}: GetUsersInput) {
  try {
    await requireAdmin();

    const currentPage = Math.max(1, Math.floor(page));
    const perPage = Math.min(100, Math.max(1, Math.floor(limit)));
    const skip = (currentPage - 1) * perPage;

    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [users, totalItems] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          imageUrl: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    if (users.length === 0) {
      const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
      return {
        users: [],
        pagination: {
          currentPage,
          totalPages,
          totalItems,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        },
      };
    }

    const userIds = users.map((u) => u.id);

    const ordersAgg = (await prisma.order.groupBy({
      by: ["userId"],
      where: { userId: { in: userIds } },
      _count: { _all: true },
      _sum: { total: true },
      _max: { createdAt: true },
    })) as Array<{
      userId: string;
      _count: { _all: number };
      _sum: { total: Prisma.Decimal | null };
      _max: { createdAt: Date | null };
    }>;

    const completedAgg = (await prisma.order.groupBy({
      by: ["userId"],
      where: {
        userId: { in: userIds },
        status: { in: [OrderStatus.DELIVERED, OrderStatus.CONFIRMED] },
      },
      _count: { _all: true },
    })) as Array<{
      userId: string;
      _count: { _all: number };
    }>;

    const addrCounts = (await prisma.address.groupBy({
      by: ["userId"],
      where: { userId: { in: userIds } },
      _count: { _all: true },
    })) as Array<{
      userId: string;
      _count: { _all: number };
    }>;

    const defaultAddrUsers = await prisma.address.findMany({
      where: { userId: { in: userIds }, isDefault: true },
      select: { userId: true },
    });
    const defaultAddrSet = new Set(defaultAddrUsers.map((a) => a.userId));

    const ordersMap = new Map(
      ordersAgg.map((r) => [
        r.userId as string,
        {
          totalOrders: r._count._all,
          totalSpent: r._sum.total,
          lastOrderAt: r._max.createdAt,
        },
      ]),
    );
    const completedMap = new Map(
      completedAgg.map((r) => [r.userId as string, r._count._all]),
    );
    const addrCountMap = new Map(
      addrCounts.map((r) => [r.userId as string, r._count._all]),
    );

    // Merge
    const rows: AdminUserRow[] = users.map((u) => {
      const o = ordersMap.get(u.id);
      const completed = completedMap.get(u.id) ?? 0;
      const addressCount = addrCountMap.get(u.id) ?? 0;
      const hasDefaultAddress = defaultAddrSet.has(u.id);

      return {
        ...u,
        totalOrders: o?.totalOrders ?? 0,
        completedOrders: completed,
        totalSpent: (
          o?.totalSpent ?? (0 as unknown as Prisma.Decimal)
        ).toString(),
        lastOrderAt: o?.lastOrderAt ?? null,
        addressCount,
        hasDefaultAddress,
      };
    });

    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

    return {
      users: JSON.parse(JSON.stringify(rows)),
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    };
  } catch (error) {
    logger.error(
      "Error fetching users for admin: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to fetch users", { cause: error });
  }
}

export async function updateUserRole(params: { userId: string; role: string }) {
  try {
    const { userId, role } = params;

    await requireAdmin();

    if (
      !Object.values(UserRole).includes(
        role as (typeof UserRole)[keyof typeof UserRole],
      )
    ) {
      throw new Error("Invalid user role");
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: role as (typeof UserRole)[keyof typeof UserRole] },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.id) {
      const clerk = await clerkClient();
      await clerk.users.updateUser(user.id, {
        publicMetadata: { id: user.id, role: user.role },
      });
    }

    return user;
  } catch (error) {
    logger.error(
      "Error updating user role: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to update user role", { cause: error });
  }
}
