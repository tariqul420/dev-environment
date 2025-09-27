"use server";

import Category from "@/models/category.model";
import Product from "@/models/product.model";
import { IProduct, ProductParams } from "@/types/product";
import { auth } from "@clerk/nextjs/server";
import { FilterQuery } from "mongoose";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import dbConnect from "../db-connect";
import logger from "../logger";
import { objectId } from "../utils";

// get all products for public

export const getProducts = async ({
  search,
  sort = "default",
  page = 1,
  limit = 12,
  category,
}: ProductParams) => {
  try {
    await dbConnect();

    const query: FilterQuery<IProduct> = {};

    // Search filter
    const rx = search && { $regex: search, $options: "i" };
    if (search) {
      query.$or = [{ title: rx }, { titleBengali: rx }];
    }

    // Category filter
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.categoryIds = categoryDoc._id;
      } else {
        return {
          products: [],
          total: 0,
          hasNextPage: false,
        };
      }
    }

    // Sort logic
    const sortOrder: { [key: string]: 1 | -1 } = {};
    if (sort === "default") sortOrder.createdAt = -1;
    else if (sort === "newest") sortOrder.createdAt = -1;
    else if (sort === "oldest") sortOrder.createdAt = 1;
    else if (sort === "price-low") sortOrder.salePrice = 1;
    else if (sort === "price-high") sortOrder.salePrice = -1;

    const skip = (page - 1) * limit;

    // Query products
    const [products, total] = await Promise.all([
      Product.find(query)
        .select(
          "_id title titleBengali regularPrice salePrice imageUrls slug tag packageDuration",
        )
        .sort(sortOrder)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    return {
      products: JSON.parse(JSON.stringify(products)),
      total,
      hasNextPage: total > page * limit,
    };
  } catch (error) {
    logger.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

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
      logger.error("Error fetching product by slug:", error);
      throw error;
    }
  },
  ["getProductBySlug"],
  { tags: ["product-by-slug"] },
);

// get all products admin
export const getProductsForAdmin = async ({
  page = 1,
  limit = 20,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;

    if (role !== "admin") {
      throw new Error("Don't have permission to perform this action!");
    }

    await dbConnect();

    const query = {
      ...(search && {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { titleBengali: { $regex: search, $options: "i" } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("categoryIds", "name slug")
        .select("_id title salePrice slug categoryId updatedAt")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ updatedAt: -1 })
        .lean(),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      products: JSON.parse(JSON.stringify(products)),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    logger.error("Error fetching products:", error);
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
    logger.error("Error deleting product:", error);
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
    logger.error("Error creating product:", error);
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
    logger.error("Error updating product:", error);
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
    logger.error("Error deleting products:", error);
    throw new Error("Failed to delete products");
  }
};
