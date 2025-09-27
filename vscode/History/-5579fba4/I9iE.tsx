import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductProps } from "@/types/product";
import ProductCard from "../root/products/product-card";

export default function CarouselContainer({
  products,
}: {
  products: ProductProps[];
}) {
  return (
    <Carousel
      opts={{
        loop: true,
      }}
    >
      <CarouselContent className="-ml-1">
        {products.map((product: ProductProps, index: number) => (
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
