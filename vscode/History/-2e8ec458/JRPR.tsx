import { ChildrenProps } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Natural Sefa",
  description:
    "Explore Natural Sefa's range of 100% natural health products. Shop herbal remedies, supplements, and wellness solutions for a healthier life.",
  keywords:
    "Natural Sefa products, natural health, herbal remedies, supplements, wellness, Bangladesh, shop online",
  openGraph: {
    title: "Products | Natural Sefa",
    description:
      "Explore Natural Sefa's range of 100% natural health products. Shop herbal remedies, supplements, and wellness solutions for a healthier life.",
    url: "https://www.naturalsefa.com/products",
    siteName: "Natural Sefa",
    images: [
      {
        url: "/assets/hero-banner-1.webp",
        width: 1200,
        height: 630,
        alt: "Natural Sefa Products",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Products | Natural Sefa",
    description:
      "Explore Natural Sefa's range of 100% natural health products. Shop herbal remedies, supplements, and wellness solutions for a healthier life.",
    images: ["/assets/hero-banner-1.webp"],
    site: "@naturalsefa",
  },
};

export default function ProductsLayout({ children }: ChildrenProps) {
  return <main>{children}</main>;
}
