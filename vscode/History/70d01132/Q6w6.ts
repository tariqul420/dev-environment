"use server";

import Category from "@/models/category.model";
import Product from "@/models/product.model";
import { IProduct, ProductParams } from "@/types/product";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import dbConnect from "../db-connect";
import { objectId } from "../utils";

// get all products for public
export const getProducts = unstable_cache(
  async ({
    search,
    sort = "default",
    page = 1,
    limit = 12,
    category,
  }: ProductParams) => {
    try {
      await dbConnect();

      // Initialize query object
      const query: Record<string, unknown> = {
        ...(search && {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { titleBengali: { $regex: search, $options: "i" } },
            { slug: { $regex: search, $options: "i" } },
          ],
        }),
      };

      // Add category filter if provided
      if (category) {
        const categories = Array.isArray(category) ? category : [category];
        const categoryIds: mongoose.Types.ObjectId[] = [];

        for (const cat of categories) {
          if (mongoose.Types.ObjectId.isValid(cat)) {
            categoryIds.push(new mongoose.Types.ObjectId(cat));
          } else {
            const categoryDoc = await Category.findOne({ slug: cat });
            if (categoryDoc) {
              categoryIds.push(categoryDoc._id);
            }
          }
        }

        if (categoryIds.length > 0) {
          query.categoryIds = { $in: categoryIds };
        }
      }

      // Define sort order
      const sortOrder: { [key: string]: 1 | -1 } = {};
      if (sort === "date") {
        sortOrder.createdAt = -1;
      } else if (sort === "price-low") {
        sortOrder.salePrice = 1;
      } else if (sort === "price-high") {
        sortOrder.salePrice = -1;
      } else {
        sortOrder.createdAt = -1;
      }

      const [products, total] = await Promise.all([
        Product.find(query)
          .select(
            "_id title titleBengali regularPrice salePrice imageUrls slug tag packageDuration",
          )
          .sort(sortOrder)
          .limit(limit * page),
        Product.countDocuments(query),
      ]);

      const hasNextPage = total > page * limit;

      return {
        products: JSON.parse(JSON.stringify(products)),
        total,
        hasNextPage,
      };
    } catch (error) {
      console.error("Error fetching products data:", error);
      throw new Error("Failed to fetch products");
    }
  },
  ["getProducts"],
  { tags: ["products"] },
);

// get single product for public
export const getProductBySlug = unstable_cache(
  async (slug: string) => {
    try {
      await dbConnect();
      const product = await Product.findOne({ slug }).populate(
        "categoryIds",
        "name slug",
      );
      return product ? JSON.parse(JSON.stringify(product)) : null;
    } catch (error) {
      console.error("Error fetching product by slug:", error);
      throw error;
    }
  },
  ["getProductBySlug"],
  { tags: ["product-by-slug"] },
);

// get all products admin
export const getProductsForAdmin = async ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    // Authentication and authorization
    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;

    if (role !== "admin") {
      throw new Error("Don't have permission to perform this action!");
    }

    // Cached database query
    const fetchProducts = unstable_cache(
      async (params: { page: number; limit: number; search: string }) => {
        try {
          await dbConnect();

          // Initialize query object
          const query = {
            ...(params.search && {
              $or: [
                { title: { $regex: params.search, $options: "i" } },
                { titleBengali: { $regex: params.search, $options: "i" } },
                { slug: { $regex: params.search, $options: "i" } },
              ],
            }),
          };

          // Execute aggregation
          const [products, total] = await Promise.all([
            Product.find(query)
              .populate("categoryIds", "name slug")
              .select("_id title salePrice slug categoryId updatedAt")
              .skip((params.page - 1) * params.limit)
              .limit(params.limit)
              .lean(),
            Product.countDocuments({
              ...(params.search && query),
            }),
          ]);

          const totalPages = Math.ceil(total / params.limit);

          return {
            products: JSON.parse(JSON.stringify(products)),
            pagination: {
              currentPage: params.page,
              totalPages,
              totalItems: total,
              hasNextPage: params.page < totalPages,
              hasPrevPage: params.page > 1,
            },
          };
        } catch (error) {
          console.error("Error fetching products:", error);
          throw new Error("Failed to fetch products");
        }
      },
      ["getProductsForAdmin"],
      { tags: ["admin-products"] },
    );

    return await fetchProducts({ page, limit, search });
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

// delete a product
export async function deleteProduct({
  productId,
  path,
}: {
  productId: string;
  path: string;
}) {
  try {
    await dbConnect();

    // Get the current logged-in user
    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;
    if (role !== "admin") {
      throw new Error("Don't have permission to perform this action!");
    }

    await Product.findOneAndDelete({
      _id: objectId(productId),
    });

    revalidatePath(path);
    revalidateTag("products");
    revalidateTag("product-by-slug");
    revalidateTag("admin-products");
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}

// create a new product
export async function createProduct({
  data,
  path,
}: {
  data: IProduct;
  path: string;
}) {
  try {
    await dbConnect();

    // Authentication and authorization
    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;

    if (role !== "admin") {
      throw new Error("Don't have permission to perform this action!");
    }

    // Add the userId as the instructor for the product
    const newProduct = new Product({ ...data });
    await newProduct.save();

    revalidatePath(path);
    revalidateTag("products");
    revalidateTag("product-by-slug");
    revalidateTag("admin-products");
    return JSON.parse(JSON.stringify(newProduct));
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

// update a existing product
export async function updateProduct({
  productId,
  data,
  path,
}: {
  productId: string;
  data: IProduct;
  path: string;
}) {
  try {
    await dbConnect();

    // Authentication and authorization
    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;

    if (role !== "admin") {
      throw new Error("Don't have permission to perform this action!");
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      data,
      { new: true },
    );

    revalidatePath(path);
    revalidateTag("products");
    revalidateTag("product-by-slug");
    revalidateTag("admin-products");
    return JSON.parse(JSON.stringify(updatedProduct));
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

// delete multiple products
export const deleteProducts = async (ids: string[]) => {
  try {
    await dbConnect();

    // Authentication and authorization
    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;

    if (role !== "admin") {
      throw new Error("Don't have permission to perform this action!");
    }

    // Delete multiple products
    const result = await Product.deleteMany({
      _id: { $in: ids },
    });

    if (result.deletedCount === 0) {
      throw new Error("No products were deleted");
    }

    // Revalidate the path to refresh the data
    revalidatePath("/admin/products");
    revalidateTag("products");
    revalidateTag("product-by-slug");
    revalidateTag("admin-products");
  } catch (error) {
    console.error("Error deleting products:", error);
    throw new Error("Failed to delete products");
  }
};
