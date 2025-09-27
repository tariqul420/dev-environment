"use client";

import { ShoppingCartIcon, Tag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import BuyNowBtn from "./buy-now-btn";
import QuantityInput from "./quantity-input";
import QuantityPrice from "./quantity-price";

export default function ProductCard({ product }: { product: ProductProps }) {
  const router = useRouter();

  const goToDetails = () => router.push(`/products/${product.id}`);

  return (
    <Card
      tabIndex={0}
      onClick={goToDetails}
      className="group flex h-full cursor-pointer flex-col transition-shadow duration-300 hover:shadow-xl"
    >
      <CardHeader className="relative">
        {product.tag && (
          <p className="absolute -bottom-2 left-8 z-[1] flex w-fit items-center gap-1.5 rounded bg-destructive px-3 py-1 text-sm font-medium capitalize text-destructive-foreground shadow">
            <Tag size={16} /> {product.tag}
          </p>
        )}

        <div className="absolute right-2 -top-4 z-[1] rounded-full bg-accent p-3 text-accent-foreground shadow-lg">
          <ShoppingCartIcon size={20} />
        </div>

        <div className="relative h-48 w-full">
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt || product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="aspect-square rounded-t-md object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-grow flex-col justify-between pt-0">
        <h3 className="mb-2 line-clamp-1 text-center">{product.title}</h3>

        <p className="mb-1 line-clamp-2 text-center capitalize">
          {product.packageDuration}
        </p>

        <QuantityPrice
          compareAtPrice={product.compareAtPrice ?? product.price}
          price={product.price}
          id={product.id}
          className="font-grotesk mb-auto text-center text-lg"
        />

        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
            }
          }}
          className="flex items-center justify-center"
          aria-label="Quantity input"
        >
          <QuantityInput id={product.id} />
        </button>
      </CardContent>

      <CardFooter
        onClick={(e) => e.stopPropagation()}
        className="flex justify-center"
      >
        <BuyNowBtn slug={product.id} className="w-full" />
      </CardFooter>
    </Card>
  );
}
