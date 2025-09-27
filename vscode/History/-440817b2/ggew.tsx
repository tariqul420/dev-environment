import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
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
      <head>
        {/* gtag */}
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <>
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `,
          }}
        />

        {/* meta pixel */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        {/* TikTok Pixel */}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
              ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie"];
              ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)));}};
              for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
              ttq.instance=function(t){var e=ttq._i[t]||[];for(var n=0;n<ttq.methods.length;n++)
              ttq.setAndDefer(e,ttq.methods[n]);return e;};
              ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
              ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;
              ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");
              o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;
              var a=document.getElementsByTagName("script")[0];
              a.parentNode.insertBefore(o,a)};
              ttq.load('${TIKTOK_PIXEL_ID}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      </head>
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
