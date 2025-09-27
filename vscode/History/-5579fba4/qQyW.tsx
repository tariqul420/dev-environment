import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductProps } from "@/types/product";
import ProductCard from "../root/products/product-card";
import { ReactNode } from "react";

interface CarouselContainerProps {
  children: ReactNode
  items: 
}

export default function CarouselContainer({
  children,
  items,
}: CarouselContainerProps) {
  return (
    <Carousel
      opts={{
        loop: true,
      }}
    >
      <CarouselContent className="-ml-1">
        {items.map((item: ProductProps, index: number) => (
          <CarouselItem
            key={index}
            className="basis-full pl-1 md:basis-1/3 lg:basis-1/4"
          >
            <div className="p-1">
              <ProductCard product={product} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
