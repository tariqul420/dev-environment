import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewProps } from "@/types/review";
import { format } from "date-fns";
import Image from "next/image";
import ProductRating from "./product-rating";

export default function ReviewCard({ review }: { review: ReviewProps }) {
  return (
    <Card className="mx-auto w-full max-w-md shadow-md transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-grow items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage
              src={`https://i.pravatar.cc/150?u=${userId}`}
              alt={`${userId}'s profile picture`}
            />
            <AvatarFallback>
              {userId.slice(0, 2).toUpperCase() || "AN"}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-semibold">@{userId}</CardTitle>
            <p className="text-muted-foreground text-sm">
              {isNaN(createdAt)
                ? "Unknown Date"
                : format(createdAt, "MMMM, yyyy")}
            </p>
          </div>
        </div>
        <ProductRating rating={review?.rating ?? 0} />
      </CardHeader>
      <CardContent>
        <div className="relative mb-3 h-40 w-full">
          <Image
            src={imageSrc}
            alt={`Product image for ${userId}'s review`}
            fill
            className="rounded-md object-cover"
            sizes="(max-width: 768px) 100vw, 448px"
            priority={false}
            quality={75}
            onError={(e) => {
              e.target.src = "/fallback-image.jpg"; // Handle image load failure
            }}
          />
        </div>
        <p className="text-gray-700">
          {review?.review || "No review provided."}
        </p>
      </CardContent>
    </Card>
  );
}
