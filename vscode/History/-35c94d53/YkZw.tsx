import ClientWrapper from "@/components/client-wrapper";
import FacebookPixel from "@/components/pixels/facebook-pixel";
import TikTokPixel from "@/components/pixels/tiktok-pixel";
import ClientClerkProvider from "@/components/providers/clerk-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ToasterProvider from "@/components/providers/toaster-provider";
import { hindSiliguri, spaceGrotesk } from "@/constant/fonts";
import { cn } from "@/lib/utils";
import OfflineProvider from "@/providers/offline-provider";
import ReduxProvider from "@/providers/redux-provider";
import type { Metadata } from "next";
import Script from "next/script";
import "react-phone-input-2/lib/style.css";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Natural Sefa | 100% Natural Health Products",
  description:
    "Shop Natural Sefa for trusted natural remedies: Methi Mix Plus, Kalojira Tel, Diabetes Cha, and more. 100% natural, delivered across Bangladesh.",
  keywords:
    "Natural Sefa, natural health, herbal remedies, Methi Mix Plus, Kalojira Tel, Diabetes Cha, Allergy Binash, Joytuner Tel, Arjun Heart Care, Bangladesh, organic health, wellness",
  metadataBase: new URL("https://naturalsefa.com"),

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "Natural Sefa | 100% Natural Health Products",
    description:
      "Shop trusted natural remedies: Methi Mix, Kalojira Tel, Diabetes Cha, and more. 100% natural, delivered across Bangladesh.",
    url: "https://naturalsefa.com",
    siteName: "Natural Sefa",
    images: [
      {
        url: "/assets/about-us.png",
        width: 800,
        height: 600,
        alt: "Natural Sefa Natural Health Products",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Natural Sefa | 100% Natural Health Products",
    description:
      "Shop trusted natural remedies: Methi Mix, Kalojira Tel, Diabetes Cha, and more. 100% natural, delivered across Bangladesh.",
    images: ["/assets/about-us.png", "/assets/hero-banner-1.png"],
    site: "@naturalsefa",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
    `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          "dark:bg-dark-deep bg-light overflow-x-hidden scroll-smooth antialiased",
          spaceGrotesk.variable,
          hindSiliguri.variable,
        )}
      >
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ClientClerkProvider>
              <main className="min-h-screen overflow-x-hidden">{children}</main>
              {/* 🎯 Pixels */}
              <FacebookPixel />
              <TikTokPixel />
              <ClientWrapper />
              <OfflineProvider />
              <ToasterProvider />
            </ClientClerkProvider>
          </ThemeProvider>
        </ReduxProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
