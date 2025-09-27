interface ReviewProps {
  product: string;
  userId: string;
  rating: number;
  image: string;
  review: string;
  createdAt: Date;
}

export default function ReviewCard({
  product,
  userId,
  rating,
  image,
  review,
  createdAt,
}: ReviewProps) {
  return (
    <Card className="mx-auto w-full max-w-md shadow-md transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage
            src={`https://i.pravatar.cc/150?u=${userId}`}
            alt="User"
          />
          <AvatarFallback>{userId.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg font-semibold">{userId}</CardTitle>
          <p className="text-muted-foreground text-sm">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.floor(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
        </div>
        <img
          src={image}
          alt="Product"
          className="mb-3 h-40 w-full rounded-md object-cover"
        />
        <p className="text-gray-700">{review}</p>
        <p className="text-muted-foreground mt-2 text-sm">
          Product ID: {product}
        </p>
      </CardContent>
    </Card>
  );
}
