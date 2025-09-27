import mongoose from "mongoose";

export interface IReview {
  _id?: string;
  product?: mongoose.Schema.Types.ObjectId | string;
  userId?: string;
  image: string;
  rating: number;
  review: string;
}

export interface ReviewProps {
  userId: string;
  rating: number;
  image: string;
  review: string;
  createdAt: Date;
}
