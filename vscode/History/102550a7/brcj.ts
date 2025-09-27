import Review from "@/models/review.model";
import { IReview } from "@/types/review";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import dbConnect from "../db-connect";

// Get all blogs for public
export const getBlogs = unstable_cache(
  async ({ search, sort = "default", page = 1, limit = 6 }: BlogParams) => {
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
      console.error("Error fetching blogs:", error);
      throw new Error("Failed to fetch blogs");
    }
  },
  ["getBlogs"],
  { tags: ["blogs"] },
);

// Create a new review
export async function createReview({
  data,
  path,
}: {
  data: IReview;
  path: string;
}): Promise<IReview> {
  try {
    await dbConnect();

    const { sessionClaims } = await auth();
    if (!sessionClaims || sessionClaims.role !== "admin") {
      throw new Error("You do not have permission to perform this action!");
    }

    const newReview = new Review({ ...data });
    await newReview.save();

    revalidatePath(path);
    revalidateTag("reviews");
    revalidateTag("review-by-id");
    revalidateTag("admin-reviews");

    return JSON.parse(JSON.stringify(newReview)) as IReview;
  } catch (error) {
    console.error("Error creating review:", error);
    throw new Error("Failed to create review");
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
