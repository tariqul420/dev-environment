import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ReactNode } from "react";

interface CarouselContainerProps {
  children: ReactNode;
  items: any[];
  className?: string;
}

export default function CarouselContainer({
  children,
  items,
  className,
}: CarouselContainerProps) {
  return (
    <Carousel
      opts={{
        loop: true,
      }}
      className={className}
    >
      <CarouselContent className="-ml-1">
        {items.map((item, index: number) => (
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
