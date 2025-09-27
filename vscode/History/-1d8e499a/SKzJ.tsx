import MyButton from "@/components/global/my-btn";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ProductProps } from "@/types/product";
import { Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }: { product: ProductProps }) {
  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group flex h-full flex-col transition-shadow duration-300 hover:shadow-xl">
        <CardHeader className="relative">
          {/* Tag Badge */}
          {product.tag && (
            <p className="bg-red text-light absolute -bottom-2 left-8 z-[1] flex w-fit items-center gap-1.5 rounded px-3 py-1 text-sm font-medium capitalize shadow">
              <Tag size={16} /> {product.tag}
            </p>
          )}

          {/* Product Image */}
          <div className="relative h-48 w-full">
            <Image
              src={product.imageUrls[0]}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="aspect-square rounded-t-md object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="flex flex-grow flex-col justify-between pt-0">
          {/* Product Name */}
          <h3 className="mb-2 line-clamp-1 text-center">
            <span className="font-grotesk text-xl font-semibold capitalize">
              {product.title}
            </span>{" "}
            -{" "}
            <span className="text-lg font-medium capitalize">
              {product.titleBengali}
            </span>
          </h3>

          {/* Product Package */}
          <p className="mb-1 line-clamp-2 text-center capitalize">
            {product.packageDuration}
          </p>

          {/* Price Section */}
          <p className="font-grotesk mb-auto text-center">
            <span className="line-through">{product.regularPrice} ৳</span> -{" "}
            <span className="text-accent-main text-lg font-bold">
              {product.salePrice} ৳
            </span>
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          {/* Call to Action */}
          <MyButton className="w-full">ওরদের করুন</MyButton>
        </CardFooter>
      </Card>
    </Link>
  );
}
