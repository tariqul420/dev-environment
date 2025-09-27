import type { Prisma } from "@prisma/client";
import logger from "../logger";
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
          { role: { contains: search, mode: "insensitive" } },
        ],
      }),
    };
  } catch (error) {
    logger.error(
      "Error fetching users for admin: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to fetch users", { cause: error });
  }
}
