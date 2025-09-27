import { IUser } from "@/types/user";
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema<IUser>(
  {
    clerkUserId: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
      required: true,
    },
    profilePicture: { type: String },
    slug: { type: String },
  },
  { timestamps: true },
);

const Review =
  mongoose.models?.User || mongoose.model<IUser>("User", reviewSchema);

export default Review;
