"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import logger from "../logger";
import { prisma } from "../prisma";
import { requireAdmin } from "../utils/auth";

export async function getCategories() {
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

export async function isCategoryInUse(id: string) {
  try {
    const count = await prisma.category.count({
      where: { id },
    });

    return count > 0;
  } catch (error) {
    logger?.error("Error checking if category is in use.");
    throw new Error("Failed to check category usage", { cause: error });
  }
}

export async function deleteCategory(id: string, path?: string) {
  await requireAdmin();

  const inUse = await isCategoryInUse(id);
  if (inUse) {
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

    if (path) {
      revalidatePath(path);
    }

    return deleted;
  } catch (err) {
    throw new Error("Failed to delete category", { cause: err });
  }
}

export async function deleteCategories(params: {
  ids: string[];
  path?: string;
}): Promise<void> {
  await requireAdmin();

  const { ids, path } = params;

  for (const id of ids) {
    const inUse = await isCategoryInUse(id);
    if (inUse) {
      throw new Error(`Cannot delete category ${id} that is in use.`);
    }
  }

  try {
    const deleted = await prisma.category.deleteMany({
      where: { id: { in: ids } },
    });

    if (deleted.count === 0) {
      throw new Error("No categories were deleted");
    }

    if (path) {
      revalidatePath(path);
    }
  } catch (err) {
    throw new Error("Failed to delete categories", { cause: err });
  }
}
