export interface IReview {
  product: mongoose.Schema.Types.ObjectId | string;
  userid: string;
  image: string;
  rating: number;
  review: string;
}
