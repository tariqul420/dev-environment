import { ChildrenProps } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Natural Sefa",
  description:
    "Get in touch with Natural Sefa for inquiries, support, or feedback. We're here to help you with your natural health journey.",
  keywords:
    "Contact Natural Sefa, customer support, health inquiries, feedback, Bangladesh, natural health",
  openGraph: {
    title: "Contact Us | Natural Sefa",
    description:
      "Get in touch with Natural Sefa for inquiries, support, or feedback. We're here to help you with your natural health journey.",
    url: "https://www.naturalsefa.com/contact-us",
    siteName: "Natural Sefa",
    images: [
      {
        url: "/assets/hero-banner-1.webp",
        width: 1200,
        height: 630,
        alt: "Contact Natural Sefa",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Natural Sefa",
    description:
      "Get in touch with Natural Sefa for inquiries, support, or feedback. We're here to help you with your natural health journey.",
    images: ["/assets/hero-banner-1.webp"],
    site: "@naturalsefa",
  },
};

export default function ContactUsLayout({ children }: ChildrenProps) {
  return <main>{children}</main>;
}
