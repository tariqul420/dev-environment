import Review from "@/models/review.model";
import { IReview } from "@/types/review";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import dbConnect from "../db-connect";

// Create a new blog
export async function createReview({
  data,
  path,
}: {
  data: IReview;
  path: string;
}) {
  try {
    await dbConnect();

    const { sessionClaims } = await auth();
    const role = sessionClaims?.role;
    if (role !== "admin") {
      throw new Error("You do not have permission to perform this action!");
    }

    const newBlog = new Review({ ...data });
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
