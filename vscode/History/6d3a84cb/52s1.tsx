import { ChildrenProps } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs | Natural Sefa",
  description:
    "Read expert articles and tips on natural health, wellness, and herbal remedies from Natural Sefa. Stay informed and inspired for a healthier life.",
  keywords:
    "Natural Sefa blogs, health articles, wellness tips, herbal remedies, natural health, Bangladesh, expert advice",
  openGraph: {
    title: "Blogs | Natural Sefa",
    description:
      "Read expert articles and tips on natural health, wellness, and herbal remedies from Natural Sefa. Stay informed and inspired for a healthier life.",
    url: "https://www.naturalsefa.com/blogs",
    siteName: "Natural Sefa",
    images: [
      {
        url: "/assets/hero-banner-1.webp",
        width: 1200,
        height: 630,
        alt: "Natural Sefa Blog Banner",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogs | Natural Sefa",
    description:
      "Read expert articles and tips on natural health, wellness, and herbal remedies from Natural Sefa. Stay informed and inspired for a healthier life.",
    images: ["/assets/hero-banner-1.webp"],
    site: "@naturalsefa",
  },
};

export default function BlogsLayout({ children }: ChildrenProps) {
  return <main>{children}</main>;
}
