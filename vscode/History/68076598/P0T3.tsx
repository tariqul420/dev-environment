import { ChildrenProps } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Natural Sefa",
  description:
    "Read the terms and conditions for using Natural Sefa's website and services. Understand your rights and responsibilities as a customer.",
  keywords:
    "Natural Sefa terms, conditions, user agreement, website policy, Bangladesh, customer rights",
  openGraph: {
    title: "Terms & Conditions | Natural Sefa",
    description:
      "Read the terms and conditions for using Natural Sefa's website and services. Understand your rights and responsibilities as a customer.",
    url: "https://www.naturalsefa.com/terms-and-conditions",
    siteName: "Natural Sefa",
    images: [
      {
        url: "/assets/hero-banner-1.webp",
        width: 1200,
        height: 630,
        alt: "Natural Sefa Terms and Conditions",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | Natural Sefa",
    description:
      "Read the terms and conditions for using Natural Sefa's website and services. Understand your rights and responsibilities as a customer.",
    images: ["/assets/hero-banner-1.webp"],
    site: "@naturalsefa",
  },
};

export default function TermsAndConditionsLayout({ children }: ChildrenProps) {
  return <main>{children}</main>;
}
