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

// Add indexes
userSchema.index({ clerkUserId: 1 }, { unique: true }); // For Clerk user ID lookups
userSchema.index({ email: 1 }, { unique: true }); // For email lookups
userSchema.index({ slug: 1 }, { unique: true }); // For slug lookups
userSchema.index({ role: 1 }); // For role filtering
userSchema.index({ createdAt: -1 }); // For sorting by date
userSchema.index({ firstName: "text", lastName: "text", email: "text" });
const Review =
  mongoose.models?.User || mongoose.model<IUser>("User", reviewSchema);

export default Review;
