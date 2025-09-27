export interface IReview {
  product?: mongoose.Schema.Types.ObjectId | string;
  userId: string;
  image: string;
  rating: number;
  review: string;
}
