"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { requireAdmin } from "../utils/auth";

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
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
        select: { id: true, name: true, createdAt: true },
      }),
      prisma.category.count({ where }),
    ]);

    return { categories, totalItems };
  } catch (err) {
    throw new Error("Failed to fetch categories", { cause: err });
  }
}
