/** biome-ignore-all lint/performance/noImgElement: <> */
"use client";

import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

type Props = {
  images?: string[];
  name?: string;
  outOfStock?: boolean;
  tag?: string | null;
  discountPercent?: number;
};

export default function ProductDetailsImage({
  images,
  name,
  outOfStock,
  tag,
  discountPercent,
}: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg border">
        <span className="text-sm text-muted-foreground">No images</span>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      <div className="relative rounded-lg border">
        {/* Top-right badges */}
        <div className="pointer-events-none absolute right-3 top-3 z-[3] flex flex-col items-end gap-2">
          {discountPercent ? (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow">
              -{discountPercent}%
            </span>
          ) : null}
          {tag ? (
            <span className="rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-white shadow">
              {tag}
            </span>
          ) : null}
        </div>

        {/* Main */}
        <Swiper
          spaceBetween={12}
          navigation
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="main-swiper"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx as number}>
              <div className="relative">
                <img
                  src={img}
                  alt={`${name || "Product"} ${idx + 1}`}
                  className="aspect-square h-full w-full rounded-lg object-cover transition-transform duration-300 ease-out hover:scale-[1.02]"
                  draggable={false}
                />
                {outOfStock && (
                  <span className="absolute inset-0 z-[2] flex items-center justify-center rounded-lg bg-black/55 text-sm font-semibold uppercase tracking-wide text-white">
                    Out of stock
                  </span>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbs */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode
        watchSlidesProgress
        modules={[FreeMode, Navigation, Thumbs]}
        className="thumbs-swiper mt-3"
        breakpoints={{
          480: { slidesPerView: 5, spaceBetween: 10 },
          768: { slidesPerView: 6, spaceBetween: 12 },
          1024: { slidesPerView: 7, spaceBetween: 12 },
        }}
      >
        {images.map((img, index) => (
          <SwiperSlide
            key={index as number}
            className="!h-20 !w-20 overflow-hidden rounded-md border transition-all data-[swiper-slide-thumb-active=true]:ring-2 data-[swiper-slide-thumb-active=true]:ring-accent"
            aria-label={`Thumbnail ${index + 1}`}
          >
            <img
              src={img}
              alt={`${name || "Product"} thumbnail ${index + 1}`}
              className="block h-full w-full cursor-pointer object-cover"
              draggable={false}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
