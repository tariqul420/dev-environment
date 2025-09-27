"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { customerReview } from "@/constant/data";
import dynamic from "next/dynamic";
import { Title } from "../../title";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function CustomerReview() {
  return (
    <section className="py-12" id="testimonials">
      <Title
        title="গ্রাহক পর্যালোচনা"
        subtitle="আমাদের পণ্য সম্পর্কে গ্রাহকদের মতামত জানুন"
      />

      <Carousel
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="-ml-1">
          {customerReview.map((review, index) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center">
                    {review && (
                      <div className="aspect-video w-full rounded-md">
                        <ReactPlayer
                          url={review}
                          width="100%"
                          height="100%"
                          controls
                          className="react-player"
                          config={{
                            file: {
                              attributes: {
                                controlsList: "nodownload",
                              },
                            },
                          }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
