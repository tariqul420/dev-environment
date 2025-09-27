import type { Decimal } from "@prisma/client/runtime/library";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFormatNumber } from "@/lib/utils/get-format-number";

interface RecommendedProduct {
  id: string;
  title: string;
  price: Decimal;
  compareAtPrice?: Decimal | null;
  images: {
    url: string;
    alt?: string | null;
  }[];
}

interface RecommendedProductsProps {
  products: RecommendedProduct[];
}

export default function RecommendedProducts({
  products,
}: RecommendedProductsProps) {
  if (!products.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="h-5 w-5" />
            Recommended For You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Complete your first order to get personalized recommendations!
            </p>
            <Link href="/products">
              <Button className="mt-4">Browse Products</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="h-5 w-5" />
          Recommended For You
        </CardTitle>
        <Link href="/products">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <div className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square relative bg-muted">
                  {product.images[0] && (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  )}
                  {product.compareAtPrice &&
                    product.compareAtPrice > product.price && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        {Math.round(
                          ((Number(product.compareAtPrice) -
                            Number(product.price)) /
                            Number(product.compareAtPrice)) *
                            100,
                        )}
                        % OFF
                      </Badge>
                    )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2 mb-2">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">
                      ৳{getFormatNumber(Number(product.price))}
                    </span>
                    {product.compareAtPrice &&
                      product.compareAtPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ৳{getFormatNumber(Number(product.compareAtPrice))}
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
