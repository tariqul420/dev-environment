import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewProps } from "@/types/review";
import { format } from "date-fns";
import Image from "next/image";
import ProductRating from "./product-rating";

export default function ReviewCard({ review }: { review: ReviewProps }) {
  return (
    <Card className="mx-auto w-full max-w-md shadow-md transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="">
        <div className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage
              src={`https://i.pravatar.cc/150?u=${review.userId}`}
              alt="User"
            />
            <AvatarFallback>
              {review.userId.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-semibold">
              @{review.userId}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {format(new Date(review.createdAt), "MMMM, yyyy")}
            </p>
          </div>
        </div>
        <ProductRating rating={review.rating} />
      </CardHeader>
      <CardContent>
        <div className="relative mb-3 h-40 w-full">
          <Image
            src={review.image}
            alt="Product"
            fill
            className="rounded-md object-cover"
            sizes="(max-width: 768px) 100vw, 448px"
            priority={false}
            quality={75}
          />
        </div>
        <p className="text-gray-700">{review.review}</p>
      </CardContent>
    </Card>
  );
}
