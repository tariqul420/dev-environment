"use server";

import Review from "@/models/review.model";
import { IReview } from "@/types/review";
import { auth } from "@clerk/nextjs/server";

import Product from "@/models/product.model";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import dbConnect from "../db-connect";
import { objectId } from "../utils/utils";

// Get all reviews for public
export const getReviews = unstable_cache(
  async (productSlug?: string) => {
    try {
      await dbConnect();

      let query = {};
      if (productSlug) {
        const product = await Product.findOne({ slug: productSlug });
        if (!product) {
          throw new Error("Product not found");
        }
        query = { product: objectId(product._id) };
      }

      const [reviews] = await Promise.all([
        Review.find(query)
          .select("_id userId rating image review createdAt")
          .lean(),
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

// Get single review by id for public
export const getReviewById = unstable_cache(
  async (id: string) => {
    try {
      await dbConnect();
      const review = await Review.findOne({ _id: objectId(id) }).lean();
      return review ? JSON.parse(JSON.stringify(review)) : null;
    } catch (error) {
      console.error("Error fetching blog by slug:", error);
      throw new Error("Failed to fetch blog by slug");
    }
  },
  ["getReviewById"],
  { tags: ["review-by-id"] },
);

// Get all reviews for admin
export const getReviewsForAdmin = async ({
  page = 1,
  limit = 10,
  search = "",
  productSlug,
}: {
  page?: number;
  limit?: number;
  search?: string;
  productSlug?: string;
}) => {
  try {
    // Authentication and authorization
    const { sessionClaims } = await auth();
    if (!sessionClaims || sessionClaims.role !== "admin") {
      throw new Error("You do not have permission to perform this action!");
    }

    let productId: string | undefined;
    if (productSlug) {
      await dbConnect();
      const product = await Product.findOne({ slug: productSlug });
      if (!product) {
        return {
          reviews: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
      }
      productId = product._id.toString();
    }

    console.log(productId);

    // Cached database query
    const fetchReviews = unstable_cache(
      async (params: {
        page: number;
        limit: number;
        search: string;
        productId?: string;
      }) => {
        try {
          await dbConnect();

          const query = {
            ...(params.productId && { product: objectId(params.productId) }),
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

    return await fetchReviews({ page, limit, search, productId });
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

    let productId = data.product;

    if (productId) {
      const product = await Product.findOne({ slug: data.product });
      if (!product) {
        throw new Error("Product not found");
      }
      productId = product._id;
    }

    const newReview = new Review({
      ...data,
      product: objectId(productId as string),
    });
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
}) {
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
export async function deleteReviews(ids: string[]) {
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

    revalidateTag("reviews");
    revalidateTag("review-by-id");
    revalidateTag("admin-reviews");
  } catch (error) {
    console.error("Error deleting reviews:", error);
    throw new Error("Failed to delete reviews");
  }
}
