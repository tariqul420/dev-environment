import { IReview } from "@/types/review";
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema<IReview>(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    userId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const Review =
  mongoose.models?.Review || mongoose.model<IReview>("Review", reviewSchema);

export default Review;
