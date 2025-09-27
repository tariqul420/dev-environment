import { z } from "zod";

export const ProductStatusEnum = z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]);

export const productUpsertSchema = z
  .object({
    title: z.string().min(2, "Title must be at least 2 characters."),
    description: z.string().optional().nullable(),
    status: ProductStatusEnum,
    price: z.coerce.number().positive("Price must be > 0"),
    compareAtPrice: z
      .union([z.coerce.number().positive().optional(), z.null()])
      .optional()
      .nullable(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    stock: z.coerce.number().int().nonnegative("Stock cannot be negative."),
    imageUrls: z
      .array(z.string().url())
      .min(1, "At least one image is required."),
    categoryIds: z.array(z.string()).min(1, "Select at least one category."),
    attributes: z
      .union([z.string(), z.record(z.string(), z.any())])
      .optional()
      .nullable(),
    path: z.string().optional(),
  })
  .refine(
    (d) => !d.compareAtPrice || (d.price && d.compareAtPrice >= d.price),
    {
      path: ["compareAtPrice"],
      message: "Compare At Price must be ≥ Price.",
    },
  );

export type ProductUpsertInput = z.infer<typeof productUpsertSchema>;
