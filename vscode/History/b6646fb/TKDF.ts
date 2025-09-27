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
  } catch (error) {
    logger.error(
      "Error fetching users for admin: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to fetch users", { cause: error });
  }
}