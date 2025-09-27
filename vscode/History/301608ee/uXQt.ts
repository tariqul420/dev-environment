"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import logger from "../logger";
import { prisma } from "../prisma";
import { requireAdmin } from "../utils/auth";

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    return JSON.parse(JSON.stringify(categories));
  } catch (err) {
    throw new Error("Failed to fetch categories", { cause: err });
  }
}

export async function createCategory(name: string, path?: string) {
  try {
    const created = await prisma.category.create({
      data: { name },
    });

    if (path) {
      revalidatePath(path);
    }

    return created;
  } catch (err) {
    throw new Error("Failed to create category", { cause: err });
  }
}

export async function getCategoriesForAdmin({
  page = 1,
  limit = 10,
  search,
}: GetUsersInput) {
  try {
    await requireAdmin();

    const currentPage = Math.max(1, Math.floor(page));
    const perPage = Math.min(100, Math.max(1, Math.floor(limit)));
    const skip = (currentPage - 1) * perPage;

    const where: Prisma.CategoryWhereInput = {
      ...(search && {
        OR: [{ name: { contains: search, mode: "insensitive" } }],
      }),
    };

    const [categories, totalItems] = await prisma.$transaction([
      prisma.category.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          parentId: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { children: true, products: true } },
        },
      }),
      prisma.category.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

    return JSON.parse(
      JSON.stringify({
        categories,
        pagination: {
          currentPage,
          totalPages,
          totalItems,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        },
      }),
    );
  } catch (err) {
    throw new Error("Failed to fetch categories", { cause: err });
  }
}

export async function updateCategory(id: string, name: string, path?: string) {
  try {
    await requireAdmin();

    const updated = await prisma.category.update({
      where: { id },
      data: { name },
    });

    if (path) {
      revalidatePath(path);
    }

    return updated;
  } catch (err) {
    throw new Error("Failed to update category", { cause: err });
  }
}

export async function isCategoryInUse(id: string): Promise<boolean> {
  try {
    const count = await prisma.productCategory.count({
      where: { categoryId: id },
    });
    return count > 0;
  } catch (error) {
    logger?.error(
      "Error checking if category is in use: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to check category usage", { cause: error });
  }
}

export async function deleteCategory(id: string, path?: string) {
  await requireAdmin();

  if (await isCategoryInUse(id)) {
    throw new Error("Cannot delete category that is in use.");
  }

  try {
    const deleted = await prisma.category.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (path) revalidatePath(path);
    return deleted;
  } catch (error) {
    logger?.error(
      "Failed to delete category: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to delete category", { cause: error });
  }
}

export async function deleteCategories(ids: string[]): Promise<void> {
  try {
    await requireAdmin();

    const inUseRows = await prisma.productCategory.findMany({
      where: { categoryId: { in: ids } },
      select: { categoryId: true },
    });
    const blockedIds = Array.from(new Set(inUseRows.map((r) => r.categoryId)));

    if (blockedIds.length > 0) {
      const blocked = await prisma.category.findMany({
        where: { id: { in: blockedIds } },
        select: { id: true, name: true },
      });
      const blockedLabel =
        blocked.length > 0
          ? blocked.map((b) => `${b.name} (${b.id})`).join(", ")
          : blockedIds.join(", ");

      throw new Error(
        `Cannot delete categories that are in use: ${blockedLabel}`,
      );
    }

    const deleted = await prisma.category.deleteMany({
      where: { id: { in: ids } },
    });

    if (deleted.count === 0) {
      throw new Error("No categories were deleted");
    }
  } catch (error) {
    logger?.error(
      "Failed to delete categories: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to delete categories", { cause: error });
  }
}