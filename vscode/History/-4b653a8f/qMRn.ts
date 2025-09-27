"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  type ProductUpsertInput,
  productUpsertSchema,
} from "@/lib/validators/product";
import logger from "../logger";
import { requireAdmin } from "../utils/auth";

const toDecimal = (n?: number | null) =>
  n == null ? null : new Prisma.Decimal(n);

export async function getAllProducts({
  search,
  sort = "default",
  page = 1,
  limit = 20,
  category,
}: ProductParams) {
  try {
    const where: Prisma.ProductWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { tag: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(category && {
        categories: {
          some: {
            category: { id: category },
          },
        },
      }),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === "oldest"
        ? { createdAt: "asc" }
        : sort === "price-low"
          ? { price: "asc" }
          : sort === "price-high"
            ? { price: "desc" }
            : { createdAt: "desc" };

    const skip = Math.max(0, (page - 1) * limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          tag: true,
          packageDuration: true,
          price: true,
          compareAtPrice: true,
          images: {
            orderBy: { sort: "asc" },
            take: 1,
            select: { url: true, alt: true },
          },
          shortDescription: true,
          // categories: {
          //   include: {
          //     category: { select: { id: true, name: true } },
          //   },
          // },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      hasNextPage: total > page * limit,
    };
  } catch (error) {
    logger.error(
      "Failed to fetch products: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to fetch products", { cause: error });
  }
}

export async function getSingleProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sort: "asc" },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const categoryIds = product.categories.map((c) => c.categoryId);

    return JSON.parse(JSON.stringify({ ...product, categoryIds }));
  } catch (error) {
    logger.error(
      "Failed to fetch product: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to fetch product", { cause: error });
  }
}

export async function createProduct(input: ProductUpsertInput, path?: string) {
  try {
    const data = productUpsertSchema.parse(input);

    const created = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        shortDescription: data.shortDescription ?? null,
        status: data.status,
        price: data.price,
        compareAtPrice: toDecimal(data.compareAtPrice ?? null),
        stock: data.stock,

        tag: data.tag ?? null,
        packageWeight: data.packageWeight ?? null,
        packageDuration: data.packageDuration ?? null,

        images: {
          create: data.imageUrls.map((url, idx) => ({ url, sort: idx })),
        },
        categories: {
          create: data.categoryIds.map((categoryId) => ({
            category: { connect: { id: categoryId } },
          })),
        },
      },
      select: { id: true },
    });

    if (path) {
      revalidatePath(path);
    }

    return created;
  } catch (error) {
    logger.error(
      "Failed to create product: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to create product", { cause: error });
  }
}

export async function updateProduct(args: {
  productId: string;
  data: ProductUpsertInput;
  path?: string;
}) {
  try {
    const { productId, data: raw } = args;
    const data = productUpsertSchema.parse(raw);

    // Update base
    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        title: data.title,
        description: data.description ?? null,
        shortDescription: data.shortDescription ?? null,
        status: data.status,
        price: data.price,
        compareAtPrice: toDecimal(data.compareAtPrice ?? null),
        stock: data.stock,

        tag: data.tag ?? null,
        packageWeight: data.packageWeight ?? null,
        packageDuration: data.packageDuration ?? null,

        // reset categories
        categories: {
          deleteMany: {},
          create: data.categoryIds.map((categoryId) => ({
            category: { connect: { id: categoryId } },
          })),
        },
      },
      select: { id: true },
    });

    // reset images
    await prisma.productImage.deleteMany({ where: { productId } });
    if (data.imageUrls.length) {
      await prisma.productImage.createMany({
        data: data.imageUrls.map((url, idx) => ({ productId, url, sort: idx })),
      });
    }

    revalidatePath("/admin/products");

    return updated;
  } catch (error) {
    logger.error(
      "Failed to update product: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to update product", { cause: error });
  }
}

export async function getProductsForAdmin({
  page = 1,
  limit = 25,
  search = "",
}: GetUsersInput) {
  try {
    await requireAdmin();

    const currentPage = Math.max(1, Math.floor(page));
    const perPage = Math.min(100, Math.max(1, Math.floor(limit)));
    const skip = (currentPage - 1) * perPage;

    const where: Prisma.ProductWhereInput = {
      ...(search && {
        OR: [{ title: { contains: search, mode: "insensitive" } }],
      }),
    };

    const [products, totalItems] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          status: true,
          price: true,
          compareAtPrice: true,
          stock: true,
          updatedAt: true,
          _count: { select: { images: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

    return JSON.parse(
      JSON.stringify({
        products,
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
      "Failed to fetch products for admin: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to fetch products for admin", { cause: error });
  }
}

export async function deleteProduct(id: string, path?: string) {
  try {
    await requireAdmin();

    const deleted = await prisma.product.delete({
      where: { id },
      select: { id: true },
    });

    if (path) {
      revalidatePath(path);
    }

    return deleted;
  } catch (error) {
    logger.error(
      "Failed to delete product: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to delete product", { cause: error });
  }
}

export async function deleteProducts(ids: string[]): Promise<void> {
  try {
    await requireAdmin();

    const deleted = await prisma.product.deleteMany({
      where: { id: { in: ids } },
    });

    if (deleted.count === 0) {
      throw new Error("No products were deleted");
    }
  } catch (error) {
    logger.error(
      "Failed to delete products: " +
        (error instanceof Error ? error.message : String(error)),
    );
    throw new Error("Failed to delete products", { cause: error });
  }
}
