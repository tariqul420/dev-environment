import { IReview } from "@/types/review";
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema<IReview>(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    userId: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    image: 
    review: {
      type: String,
      min: [5, "Review must be at least 5 characters long."],
      max: [200, "Review cannot exceed 200 characters."],
    },
  },
  { timestamps: true },
);

const Review =
  mongoose.models?.Review || mongoose.model<IReview>("Review", reviewSchema);

export default Review;
