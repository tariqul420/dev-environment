"use server";

import Category from "@/models/category.model";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import dbConnect from "../db-connect";

// get all public categories
export const getCategories = unstable_cache(
  async () => {
    try {
      await dbConnect();
      const categories = await Category.find().select("_id name slug").lean();
      return JSON.parse(JSON.stringify(categories));
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
  ["getCategories"],
  { tags: ["categories"] },
);

// create a new category
export async function createCategory(categoryName: string, path?: string) {
  try {
    await dbConnect();
    const newCategory = new Category({ name: categoryName });
    const category = await newCategory.save();

    // Revalidate the provided path or default to categories page
    revalidatePath(path || "/admin/categories");
    revalidateTag("categories");
    revalidateTag("admin-categories");
    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

// get all categories for admin
export const getCategoriesForAdmin = async ({
  page = 1,
  limit = 20,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    await dbConnect();

    // Authentication and authorization
    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;

    if (role !== "admin") {
      throw new Error("Don't have permission to perform this action!");
    }

    const skip = (page - 1) * limit;

    // Create search query
    const searchQuery = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const [categories, totalCategories] = await Promise.all([
      Category.find(searchQuery)
        .skip(skip)
        .limit(limit)
        .sort({ updatedAt: -1 }),
      Category.countDocuments(searchQuery),
    ]);

    const totalPages = Math.ceil(totalCategories / limit);

    return {
      categories: JSON.parse(JSON.stringify(categories)),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCategories,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

// update a category
export async function updateCategory(categoryId: string, categoryName: string) {
  try {
    await dbConnect();
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { name: categoryName },
      { new: true },
    );

    if (!category) {
      throw new Error("Category not found");
    }

    revalidatePath("/admin/categories");
    revalidateTag("categories");
    revalidateTag("admin-categories");
    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

// check if category is in use
export async function isCategoryInUse(categoryId: string) {
  try {
    await dbConnect();
    const Product = mongoose.models.Product;
    const count = await Product.countDocuments({ categoryIds: categoryId });
    return count > 0;
  } catch (error) {
    console.error("Error checking if category is in use:", error);
    throw error;
  }
}

// delete a category
export async function deleteCategory(categoryId: string) {
  try {
    await dbConnect();

    // Authentication and authorization
    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;

    if (role !== "admin") {
      throw new Error("Don't have permission to perform this action!");
    }

    // Check if category is in use
    const inUse = await isCategoryInUse(categoryId);
    if (inUse) {
      throw new Error(
        "Cannot delete category that is being used by categories",
      );
    }

    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    revalidatePath("/admin/categories");
    revalidateTag("categories");
    revalidateTag("admin-categories");
    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

// delete multiple categories
export const deleteCategories = async (ids: string[]) => {
  try {
    await dbConnect();

    // Authentication and authorization
    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;

    if (role !== "admin") {
      throw new Error("Don't have permission to perform this action!");
    }

    // Check if any category is in use
    const categoryChecks = await Promise.all(
      ids.map(async (id) => {
        const inUse = await isCategoryInUse(id);
        return { id, inUse };
      }),
    );

    const inUseCategory = categoryChecks.find((check) => check.inUse);
    if (inUseCategory) {
      throw new Error(
        `Cannot delete category with ID ${inUseCategory.id} because it is being used by products`,
      );
    }

    // Delete multiple categories
    const result = await Category.deleteMany({
      _id: { $in: ids },
    });

    if (result.deletedCount === 0) {
      throw new Error("No categories were deleted");
    }

    // Revalidate the path to refresh the data
    revalidatePath("/admin/categories");
    revalidateTag("categories");
    revalidateTag("admin-categories");
  } catch (error) {
    console.error("Error deleting categories:", error);
    throw error;
  }
};
