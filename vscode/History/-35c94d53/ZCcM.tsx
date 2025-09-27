import ClientWrapper from "@/components/client-wrapper";
import ClientClerkProvider from "@/components/providers/clerk-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ToasterProvider from "@/components/providers/toaster-provider";
import { dmSerif, hindSiliguri, inter, spaceGrotesk } from "@/constant/fonts";
import { cn } from "@/lib/utils";
import OfflineProvider from "@/providers/offline-provider";
import ReduxProvider from "@/providers/redux-provider";
import type { Metadata } from "next";
import Script from "next/script";
import "react-phone-input-2/lib/style.css";
import { Toaster } from "sonner";
import "./globals.css";
import PageViewTracker from "@/components/pixels/page-view-tracker";
import { Suspense } from "react";
import { MetaPixelProvider } from "@/components/pixels/meta-pixel-provider";

export const metadata: Metadata = {
  title: "Natural Sefa | 100% Natural Health Products",
  description:
    "Shop Natural Sefa for trusted natural remedies: Methi Mix Plus, Kalojira Tel, Diabetes Cha, and more. 100% natural, delivered across Bangladesh.",
  keywords:
    "Natural Sefa, natural health, herbal remedies, Methi Mix Plus, Kalojira Tel, Diabetes Cha, Allergy Binash, Joytuner Tel, Arjun Heart Care, Bangladesh, organic health, wellness",
  metadataBase: new URL("https://naturalsefa.com"),

  icons: {
    icon: "/assets/icon-circle.webp",
    shortcut: "/assets/icon-circle.webp",
    apple: "/assets/icon-circle.webp",
  },

  openGraph: {
    title: "Natural Sefa | 100% Natural Health Products",
    description:
      "Shop trusted natural remedies: Methi Mix, Kalojira Tel, Diabetes Cha, and more. 100% natural, delivered across Bangladesh.",
    url: "https://naturalsefa.com",
    siteName: "Natural Sefa",
    images: [
      {
        url: "/assets/about-us.webp",
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
    images: ["/assets/about-us.webp", "/assets/hero-banner-1.webp"],
    site: "@naturalsefa",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  // const fbId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const tiktokId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        {gaId && (
          <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}</Script>
          </>
        )}

        {/* Facebook Pixel */}
      

        {/* TikTok Pixel */}
        {tiktokId && (
          <Script id="ttq-init" strategy="afterInteractive">{`
            !function (w, d, t) {
              w.TiktokAnalyticsObject = t;
              var ttq = w[t] = w[t] || [];
              ttq.methods = ["page","track","identify","instances","debug","on","off","once","ready","setUserProperties","share","unshare","setDestination","setConsent"];
              ttq.setAndDefer = function(t, e){ t[e] = function(){ t.push([e].concat(Array.prototype.slice.call(arguments,0))) } };
              for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
              ttq.instance = function(t){ var e = ttq._i[t] || []; for (var n=0; n<ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e };
              ttq.load = function(e){ var n = "https://analytics.tiktok.com/i18n/pixel/events.js";
                ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = n;
                ttq._t = ttq._t || {}; ttq._t[e] = +new Date();
                var a = d.createElement("script"); a.type = "text/javascript"; a.async = true; a.src = n + "?sdkid=" + e + "&lib=" + t;
                var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(a, s);
              };
              ttq.load('${tiktokId}');
              ttq.page();
            }(window, document, 'ttq');
          `}</Script>
        )}
      </head>

      <body
        suppressHydrationWarning
        className={cn(
          "dark:bg-dark-deep bg-light overflow-x-hidden scroll-smooth antialiased",
          spaceGrotesk.variable,
          hindSiliguri.variable,
          dmSerif.variable,
          inter.variable,
        )}
      >
        {/* SPA PageView */}
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>

        <ReduxProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <ClientClerkProvider>
              <main className="min-h-screen overflow-x-hidden">{children}</main>
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