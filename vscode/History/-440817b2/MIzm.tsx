import type { Metadata } from "next";
import "./globals.css";
import ClientClerkProvider from "@/components/providers/client-clerk-provider";
import ReduxProvider from "@/components/providers/redux-provider";
import ReferralProvider from "@/components/providers/referral-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ToasterProvider from "@/components/providers/toaster-provider";
import { hindSiliguri, spaceGrotesk } from "@/lib/constant/fonts";

export const metadata: Metadata = {
  title: {
    default: "Natural Sefa | প্রকৃতিতেই আরোগ্য",
    template: "%s - Natural Sefa",
  },
  description:
    "Natural Sefa (ন্যাচারাল সেফা) – 100% herbal remedies for gastric, digestion, and overall wellness. Trusted Bangladeshi brand with natural healing solutions.",
  keywords: [
    "Natural Sefa",
    "ন্যাচারাল সেফা",
    "মেথি মিক্স প্লাস",
    "herbal gastric remedy",
    "natural medicine Bangladesh",
    "digestive health",
    "আয়ুর্বেদিক ঔষধ",
    "gastric solution",
    "herbal products BD",
  ],
  authors: [{ name: "Natural Sefa Team", url: "https://naturalsefa.com" }],
  creator: "Natural Sefa",
  publisher: "Natural Sefa",
  metadataBase: new URL("https://naturalseefa.com"),
  openGraph: {
    title: "Natural Sefa | ন্যাচারাল সেফা",
    description:
      "Trusted herbal products for gastric, digestion, and natural wellness in Bangladesh.",
    url: "https://naturalsefa.com",
    siteName: "Natural Sefa",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Natural Sefa Herbal Products",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Natural Sefa | ন্যাচারাল সেফা",
    description:
      "Natural herbal solutions for gastric and wellness in Bangladesh.",
    images: ["/og-image.jpg"],
    creator: "@naturalsefa",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  category: "health",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${hindSiliguri.variable} antialiased`}
    >
      <head></head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ReduxProvider>
          <ThemeProvider>
            <ClientClerkProvider>
              <main>{children}</main>
              <ReferralProvider />
              <ToasterProvider />
            </ClientClerkProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
