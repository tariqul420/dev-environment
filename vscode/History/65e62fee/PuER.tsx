import { ChildrenProps } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Natural Sefa",
  description:
    "Learn about Natural Sefa's mission to provide 100% natural health solutions in Bangladesh. Discover our story, values, and commitment to wellness.",
  keywords:
    "About Natural Sefa, our story, natural health, wellness, Bangladesh, herbal remedies, company values",
  openGraph: {
    title: "About Us | Natural Sefa",
    description:
      "Learn about Natural Sefa's mission to provide 100% natural health solutions in Bangladesh. Discover our story, values, and commitment to wellness.",
    url: "https://www.naturalsefa.com/about-us",
    siteName: "Natural Sefa",
    images: [
      {
        url: "/assets/about-us.webp",
        width: 800,
        height: 600,
        alt: "About Natural Sefa Team",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Natural Sefa",
    description:
      "Learn about Natural Sefa's mission to provide 100% natural health solutions in Bangladesh. Discover our story, values, and commitment to wellness.",
    images: ["/assets/about-us.webp"],
    site: "@naturalsefa",
  },
};

export default function AboutUsLayout({ children }: ChildrenProps) {
  return <main>{children}</main>;
}
