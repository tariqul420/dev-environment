import ClientWrapper from "@/components/client-wrapper";
import FacebookPixel from "@/components/pixels/facebook-pixel";
import TikTokPixel from "@/components/pixels/tiktok-pixel";
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

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* gtag */}
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
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
              `}
            </Script>
            {/* noscript fallback */}
            <noscript>
              // eslint-disable-next-line @next/next/no-img-element
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          
       
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
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ClientClerkProvider>
              <main className="min-h-screen overflow-x-hidden">{children}</main>
              {/* Pixels */}
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
