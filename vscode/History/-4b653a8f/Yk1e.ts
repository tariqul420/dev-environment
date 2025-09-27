"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  type ProductUpsertInput,
  productUpsertSchema,
} from "@/lib/validators/product";

const toDecimal = (n?: number | null) =>
  n == null ? null : new Prisma.Decimal(n);

export async function createProduct(input: ProductUpsertInput) {
  const data = productUpsertSchema.parse(input);

  const created = await prisma.product.create({
    data: {
      title: data.title,
      description: data.description ?? null,
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

  revalidatePath("/admin/products");

  return created;
}

export async function updateProduct(args: {
  productId: string;
  data: ProductUpsertInput;
  path?: string;
}) {
  const { productId, data: raw } = args;
  const data = productUpsertSchema.parse(raw);

  // Update base
  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      title: data.title,
      description: data.description ?? null,
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
}
