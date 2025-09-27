import { ChildrenProps } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Refunds Policy | Natural Sefa",
  description:
    "Read Natural Sefa's returns and refunds policy to understand your rights and our process for product returns and refunds.",
  keywords:
    "Natural Sefa returns, refunds policy, product returns, money back, Bangladesh, customer service",
  openGraph: {
    title: "Returns & Refunds Policy | Natural Sefa",
    description:
      "Read Natural Sefa's returns and refunds policy to understand your rights and our process for product returns and refunds.",
    url: "https://www.naturalsefa.com/returns-and-refunds-policy",
    siteName: "Natural Sefa",
    images: [
      {
        url: "/assets/hero-banner-1.webp",
        width: 1200,
        height: 630,
        alt: "Natural Sefa Returns and Refunds Policy",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Returns & Refunds Policy | Natural Sefa",
    description:
      "Read Natural Sefa's returns and refunds policy to understand your rights and our process for product returns and refunds.",
    images: ["/assets/hero-banner-1.webp"],
    site: "@naturalsefa",
  },
};

export default function ReturnsAndRefundsPolicyLayout({
  children,
}: ChildrenProps) {
  return <main>{children}</main>;
}
