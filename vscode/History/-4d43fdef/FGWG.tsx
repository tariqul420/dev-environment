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
      <div className="relative overflow-hidden rounded-lg border">
        {/* Top-right badges */}
        <div className="pointer-events-none absolute right-2 top-2 z-[3] flex flex-col items-end gap-1.5 sm:right-3 sm:top-3">
          {typeof discountPercent === "number" ? (
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold text-accent-foreground shadow sm:px-3 sm:py-1 sm:text-xs">
              -{discountPercent}%
            </span>
          ) : null}
          {tag ? (
            <span className="rounded-full bg-destructive px-2.5 py-0.5 text-[10px] font-semibold text-white shadow sm:px-3 sm:py-1 sm:text-xs">
              {tag}
            </span>
          ) : null}
        </div>

        {/* Main */}
        <div className="overflow-hidden">
          <Swiper
            spaceBetween={8}
            navigation
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="main-swiper"
            style={
              {
                // make nav buttons smaller overall
                "--swiper-navigation-size": "20px",
              } as React.CSSProperties
            }
          >
            {images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative">
                  <img
                    src={img}
                    alt={`${name || "Product"} ${idx + 1}`}
                    className="aspect-square h-full w-full object-cover sm:rounded-lg transition-transform duration-300 ease-out md:hover:scale-[1.02]"
                    draggable={false}
                  />
                  {outOfStock && (
                    <span className="absolute inset-0 z-[2] flex items-center justify-center rounded-none bg-black/65 text-xs font-semibold uppercase tracking-wide text-white sm:rounded-lg sm:text-sm">
                      Out of stock
                    </span>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Thumbs */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={8}
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
            key={index}
            className="!h-14 !w-14 overflow-hidden rounded-md border transition-all data-[swiper-slide-thumb-active=true]:ring-2 data-[swiper-slide-thumb-active=true]:ring-accent sm:!h-16 sm:!w-16 md:!h-20 md:!w-20"
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

      {/* Global tweaks specific to this gallery */}
      <style jsx global>{`
        /* Hide stray scrollbars on some mobile browsers */
        .product-gallery .main-swiper,
        .product-gallery .thumbs-swiper,
        .product-gallery .main-swiper .swiper-wrapper,
        .product-gallery .thumbs-swiper .swiper-wrapper {
          overflow: hidden !important;
        }
        /* Reduce nav buttons on small screens */
        @media (max-width: 767px) {
          .product-gallery .swiper-button-prev,
          .product-gallery .swiper-button-next {
            width: 28px;
            height: 28px;
          }
          .product-gallery .swiper-button-prev::after,
          .product-gallery .swiper-button-next::after {
            font-size: 16px;
          }
        }
        /* Keep buttons inside rounded corners */
        .product-gallery .swiper-button-prev,
        .product-gallery .swiper-button-next {
          top: 50%;
          transform: translateY(-50%);
        }
      `}</style>
    </div>
  );
}
