/* eslint-disable @next/next/no-img-element */
"use client";

import logger from "@/lib/logger";
import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface ProductDetailsImageProps {
  images: string[] | undefined;
  name: string | undefined;
}

export default function ProductDetailsImage({
  images,
  name,
}: ProductDetailsImageProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const handleImageError = (img: string, index: number) => {
    logger.error(`Failed to load image ${index + 1}:`, img);
  };

  if (!images || images.length === 0) {
    return (
      <div className="dark:bg-dark-lite flex h-[359px] items-center justify-center border">
        <span>No Images Available</span>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      <Swiper
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="main-swiper"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt={`${name} Image ${index + 1}`}
              className="aspect-square h-[440px] w-full rounded-md object-cover"
              onError={() => handleImageError(img, index)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbs */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode
        watchSlidesProgress
        modules={[FreeMode, Navigation, Thumbs]}
        className="thumbs-swiper mt-4"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            {/* fixed square container + overflow hidden */}
            <div className="h-20 w-20 overflow-hidden rounded-md">
              <img
                src={img}
                alt={`${name} Thumbnail ${index + 1}`}
                className="block h-full w-full cursor-pointer object-cover"
                onError={() => handleImageError(img, index)}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
