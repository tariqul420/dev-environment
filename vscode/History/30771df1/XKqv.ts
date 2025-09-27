"use server";

import Blog from "@/models/blog.model";
import { BlogParams, IBlog } from "@/types/blog";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import dbConnect from "../db-connect";
import logger from "../logger";
import { objectId } from "../utils/utils";

// Get all blogs for public
export const getBlogs = async ({
  search,
  sort = "default",
  page = 1,
  limit = 6,
}: BlogParams) => {
  try {
    await dbConnect();

    const query = {
      ...(search && {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { slug: { $regex: search, $options: "i" } },
        ],
      }),
    };

    const sortOrder: { [key: string]: 1 | -1 } = {
      createdAt: sort === "date" ? -1 : -1,
    };

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .select("_id title image description slug createdAt")
        .sort(sortOrder)
        .limit(limit * page)
        .lean(),
      Blog.countDocuments(query),
    ]);

    const hasNextPage = total > page * limit;

    return {
      blogs: JSON.parse(JSON.stringify(blogs)),
      total,
      hasNextPage,
    };
  } catch (error) {
    logger.error("Error fetching blogs:", error);
    throw new Error("Failed to fetch blogs");
  }
};

// Get single blog by slug for public
export const getBlogBySlug = unstable_cache(
  async (slug: string) => {
    try {
      await dbConnect();
      const blog = await Blog.findOne({ slug }).lean();
      return blog ? JSON.parse(JSON.stringify(blog)) : null;
    } catch (error) {
      console.error("Error fetching blog by slug:", error);
      throw new Error("Failed to fetch blog by slug");
    }
  },
  ["getBlogBySlug"],
  { tags: ["blog-by-slug"] },
);

// Get all blogs for admin
export const getBlogsForAdmin = async ({
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
      throw new Error("You do not have permission to perform this action!");
    }

    const query = {
      ...(search && {
        $or: [{ title: { $regex: search, $options: "i" } }],
      }),
    };

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .select("_id title createdAt updatedAt slug")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ updatedAt: -1 })
        .lean(),
      Blog.countDocuments({
        ...(search && query),
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      blogs: JSON.parse(JSON.stringify(blogs)),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw new Error("Failed to fetch blogs");
  }
};

// Delete a blog
export async function deleteBlog({
  blogId,
  path,
}: {
  blogId: string;
  path: string;
}) {
  try {
    await dbConnect();

    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;
    if (role !== "admin") {
      throw new Error("You do not have permission to perform this action!");
    }

    const result = await Blog.findOneAndDelete({
      _id: objectId(blogId),
    });

    if (!result) {
      throw new Error("Blog not found");
    }

    revalidatePath(path);
    revalidateTag("blogs");
    revalidateTag("blog-by-slug");
    revalidateTag("admin-blogs");

    return { success: true };
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw new Error("Failed to delete blog");
  }
}

// Create a new blog
export async function createBlog({
  data,
  path,
}: {
  data: IBlog;
  path: string;
}) {
  try {
    await dbConnect();

    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;
    if (role !== "admin") {
      throw new Error("You do not have permission to perform this action!");
    }

    const newBlog = new Blog({ ...data });
    await newBlog.save();

    revalidatePath(path);
    revalidateTag("blogs");
    revalidateTag("blog-by-slug");
    revalidateTag("admin-blogs");

    return JSON.parse(JSON.stringify(newBlog));
  } catch (error) {
    console.error("Error creating blog:", error);
    throw new Error("Failed to create blog");
  }
}

// Update an existing blog
export async function updateBlog({
  blogId,
  data,
  path,
}: {
  blogId: string;
  data: IBlog;
  path: string;
}) {
  try {
    await dbConnect();

    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;
    if (role !== "admin") {
      throw new Error("You do not have permission to perform this action!");
    }

    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: objectId(blogId) },
      data,
      { new: true },
    );

    if (!updatedBlog) {
      throw new Error("Blog not found");
    }

    revalidatePath(path);
    revalidateTag("blogs");
    revalidateTag("blog-by-slug");
    revalidateTag("admin-blogs");

    return JSON.parse(JSON.stringify(updatedBlog));
  } catch (error) {
    console.error("Error updating blog:", error);
    throw new Error("Failed to update blog");
  }
}

// Delete multiple blogs
export async function deleteBlogs(ids: string[]) {
  try {
    await dbConnect();

    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;
    if (role !== "admin") {
      throw new Error("You do not have permission to perform this action!");
    }

    const result = await Blog.deleteMany({
      _id: { $in: ids.map((id) => objectId(id)) },
    });

    if (result.deletedCount === 0) {
      throw new Error("No blogs were deleted");
    }

    revalidatePath("/admin/blogs");
    revalidateTag("blogs");
    revalidateTag("blog-by-slug");
    revalidateTag("admin-blogs");
  } catch (error) {
    console.error("Error deleting blogs:", error);
    throw new Error("Failed to delete blogs");
  }
}
