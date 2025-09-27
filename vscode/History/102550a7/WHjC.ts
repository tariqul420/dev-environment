import Review from "@/models/review.model";
import { IReview } from "@/types/review";
import { auth } from "@clerk/nextjs/server";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import dbConnect from "../db-connect";
import { objectId } from "../utils";

// Get all reviews for public
export const getReviews = unstable_cache(
  async () => {
    try {
      await dbConnect();

      const [reviews] = await Promise.all([
        Review.find().select("_id userId rating image review createdAt").lean(),
      ]);

      return {
        reviews: JSON.parse(JSON.stringify(reviews)),
      };
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw new Error("Failed to fetch reviews");
    }
  },
  ["getReviews"],
  { tags: ["reviews"] },
);

// Get all reviews for admin
export const getReviewsForAdmin = async ({
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
    if (!sessionClaims || sessionClaims.role !== "admin") {
      throw new Error("You do not have permission to perform this action!");
    }

    // Cached database query
    const fetchReviews = unstable_cache(
      async (params: { page: number; limit: number; search: string }) => {
        try {
          await dbConnect();

          const query = {
            ...(params.search && {
              $or: [
                { review: { $regex: params.search, $options: "i" } },
                { userId: { $regex: params.search, i: "i" } },
              ],
            }),
          };

          const [reviews, total] = await Promise.all([
            Review.find(query)
              .select(
                "_id product userId rating image review createdAt updatedAt",
              )
              .skip((params.page - 1) * params.limit)
              .limit(params.limit)
              .lean(),
            Review.countDocuments(query),
          ]);

          const totalPages = Math.ceil(total / params.limit);

          return {
            reviews: JSON.parse(JSON.stringify(reviews)),
            pagination: {
              currentPage: params.page,
              totalPages,
              totalItems: total,
              hasNextPage: params.page < totalPages,
              hasPrevPage: params.page > 1,
            },
          };
        } catch (error) {
          console.error("Error fetching reviews:", error);
          throw new Error("Failed to fetch reviews");
        }
      },
      ["getReviewsForAdmin"],
      { tags: ["admin-reviews"] },
    );

    return await fetchReviews({ page, limit, search });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to fetch reviews");
  }
};

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

// Update an existing review
export async function updateReview({
  reviewId,
  data,
  path,
}: {
  reviewId: string;
  data: Partial<IReview>;
  path: string;
}): Promise<IReview> {
  try {
    await dbConnect();

    const { sessionClaims } = await auth();
    if (!sessionClaims || sessionClaims.role !== "admin") {
      throw new Error("You do not have permission to perform this action!");
    }

    const updatedReview = await Review.findOneAndUpdate(
      { _id: objectId(reviewId) },
      { $set: data },
      { new: true },
    );

    if (!updatedReview) {
      throw new Error("Review not found");
    }

    revalidatePath(path);
    revalidateTag("reviews");
    revalidateTag("review-by-id");
    revalidateTag("admin-reviews");

    return JSON.parse(JSON.stringify(updatedReview)) as IReview;
  } catch (error) {
    console.error("Error updating review:", error);
    throw new Error("Failed to update review");
  }
}

// Delete a review
export async function deleteReview({
  reviewId,
  path,
}: {
  reviewId: string;
  path: string;
}): Promise<{ success: boolean }> {
  try {
    await dbConnect();

    const { sessionClaims } = await auth();
    if (!sessionClaims || sessionClaims.role !== "admin") {
      throw new Error("You do not have permission to perform this action!");
    }

    const result = await Review.findOneAndDelete({
      _id: objectId(reviewId),
    });

    if (!result) {
      throw new Error("Review not found");
    }

    revalidatePath(path);
    revalidateTag("reviews");
    revalidateTag("review-by-id");
    revalidateTag("admin-reviews");

    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error("Failed to delete review");
  }
}

// Delete multiple reviews
export async function deleteReviews({
  ids,
  path,
}: {
  ids: string[];
  path: string;
}): Promise<{ success: boolean; deletedCount: number }> {
  try {
    await dbConnect();

    const { sessionClaims } = await auth();
    if (!sessionClaims || sessionClaims.role !== "admin") {
      throw new Error("You do not have permission to perform this action!");
    }

    const result = await Review.deleteMany({
      _id: { $in: ids.map((id) => objectId(id)) },
    });

    if (result.deletedCount === 0) {
      throw new Error("No reviews were deleted");
    }

    revalidatePath(path);
    revalidateTag("reviews");
    revalidateTag("review-by-id");
    revalidateTag("admin-reviews");

    return { success: true, deletedCount: result.deletedCount };
  } catch (error) {
    console.error("Error deleting reviews:", error);
    throw new Error("Failed to delete reviews");
  }
}
