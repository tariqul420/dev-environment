import type { Prisma } from "@prisma/client";
import logger from "../logger";
import { prisma } from "../prisma";
import { requireAdmin } from "../utils/auth";

export async function getUserForAdmin({
  page = 1,
  limit = 20,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
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
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

    return JSON.parse(
      JSON.stringify({
        users,
        pagination: {
          currentPage,
          totalPages,
          totalItems,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        },
      }),
    );
  } catch (error) {
    logger.error(
      "Error fetching users for admin: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to fetch users", { cause: error });
  }
}
