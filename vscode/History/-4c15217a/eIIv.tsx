import { ChildrenProps } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Natural Sefa",
  description:
    "Securely complete your purchase of natural health products from Natural Sefa. Fast, safe, and easy checkout process.",
  keywords:
    "Natural Sefa checkout, buy natural products, secure payment, health products, Bangladesh, order online",
  openGraph: {
    title: "Checkout | Natural Sefa",
    description:
      "Securely complete your purchase of natural health products from Natural Sefa. Fast, safe, and easy checkout process.",
    url: "https://www.naturalsefa.com/checkout",
    siteName: "Natural Sefa",
    images: [
      {
        url: "/assets/hero-banner-1.webp",
        width: 1200,
        height: 630,
        alt: "Natural Sefa Checkout",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Checkout | Natural Sefa",
    description:
      "Securely complete your purchase of natural health products from Natural Sefa. Fast, safe, and easy checkout process.",
    images: ["/assets/hero-banner-1.webp"],
    site: "@naturalsefa",
  },
};

export default function CheckoutLayout({ children }: ChildrenProps) {
  return <main>{children}</main>;
}
