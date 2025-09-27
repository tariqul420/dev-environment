"use client";

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
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: ProductProps }) {
  const router = useRouter();
  const goToDetails = () => router.push(`/products/${product.slug}`);

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={goToDetails}
      onKeyDown={(e) => e.key === "Enter" && goToDetails()}
      className="group flex h-full cursor-pointer flex-col transition-shadow duration-300 hover:shadow-xl"
    >
      <CardHeader className="relative">
        {product.tag && (
          <p className="bg-red text-light absolute -bottom-2 left-8 z-[1] flex w-fit items-center gap-1.5 rounded px-3 py-1 text-sm font-medium capitalize shadow">
            <Tag size={16} /> {product.tag}
          </p>
        )}

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
        <h3 className="mb-2 line-clamp-1 text-center">
          <span className="font-grotesk text-xl font-semibold capitalize">
            {product.title}
          </span>{" "}
          -{" "}
          <span className="text-lg font-medium capitalize">
            {product.titleBengali}
          </span>
        </h3>

        <p className="mb-1 line-clamp-2 text-center capitalize">
          {product.packageDuration}
        </p>

        <p className="font-grotesk mb-auto text-center">
          <span className="line-through">{product.regularPrice} ৳</span> -{" "}
          <span className="text-accent-main text-lg font-bold">
            {product.salePrice} ৳
          </span>
        </p>
      </CardContent>

      <CardFooter
        onClick={(e) => e.stopPropagation()}
        className="flex justify-center"
      >
        <MyButton href={`/checkout?slug=${product.slug}`} className="w-full">
          অর্ডার করুন
        </MyButton>
      </CardFooter>
    </Card>
  );
}
