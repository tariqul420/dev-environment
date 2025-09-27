import { IReview } from "@/types/review";
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema<IReview>(
  {
    product: ,
  },
  { timestamps: true },
);

const Review =
  mongoose.models?.Review || mongoose.model<IReview>("Review", reviewSchema);

export default Review;
