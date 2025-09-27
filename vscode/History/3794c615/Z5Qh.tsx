import { ChildrenProps } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Natural Sefa",
  description:
    "Read Natural Sefa's privacy policy to learn how we protect your personal information and ensure your data security.",
  keywords:
    "Natural Sefa privacy policy, data protection, personal information, security, Bangladesh, user privacy",
  openGraph: {
    title: "Privacy Policy | Natural Sefa",
    description:
      "Read Natural Sefa's privacy policy to learn how we protect your personal information and ensure your data security.",
    url: "https://www.naturalsefa.com/privacy-policy",
    siteName: "Natural Sefa",
    images: [
      {
        url: "/assets/hero-banner-1.webp",
        width: 1200,
        height: 630,
        alt: "Natural Sefa Privacy Policy",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Natural Sefa",
    description:
      "Read Natural Sefa's privacy policy to learn how we protect your personal information and ensure your data security.",
    images: ["/assets/hero-banner-1.webp"],
    site: "@naturalsefa",
  },
};

export default function PrivacyPolicyLayout({ children }: ChildrenProps) {
  return <main>{children}</main>;
}
