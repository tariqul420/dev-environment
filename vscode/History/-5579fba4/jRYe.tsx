import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CarouselContainerProps<T> {
  children: ReactNode | ((item: T) => ReactNode);
  items: T[];
  className?: string;
}

export default function CarouselContainer<T>({
  children,
  items,
  className,
}: CarouselContainerProps<T>) {
  return (
    <Carousel
      opts={{
        loop: true,
      }}
    >
      <CarouselContent className="-ml-1">
        {items.map((item, index: number) => (
          <CarouselItem
            key={index}
            className={cn(
              "basis-full pl-1 md:basis-1/3 lg:basis-1/4",
              className,
            )}
          >
            <div className="p-1">
              {typeof children === "function" ? children(item) : children}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
