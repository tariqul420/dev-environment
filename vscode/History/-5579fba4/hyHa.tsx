import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductProps } from "@/types/product";
import { ReactNode } from "react";

interface CarouselContainerProps {
  children: ReactNode;
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
            <div className="p-1">{children}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
