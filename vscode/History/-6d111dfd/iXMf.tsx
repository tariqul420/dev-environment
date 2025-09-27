import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "leaflet/dist/leaflet.css";
import "./globals.css";

import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import JsonLd from "@/components/seo/json-ld";
import { ToolsData } from "@/data/tools";
import { buildDynamicKeywords, mergeKeywords, siteDescriptionFallback } from "@/lib/seo-tools";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

const STATIC_KEYWORDS = [
  "online tools",
  "url shortener",
  "pdf tools",
  "image converter",
  "text utilities",
  "developer tools",
  "calculators",
  "free tools",
  "privacy friendly",
  "seo tools",
  "unit converter",
  "hash generator",
  "regex tester",
  "json formatter",
];

const DYNAMIC_KEYWORDS = buildDynamicKeywords(ToolsData);
const KEYWORDS = mergeKeywords(STATIC_KEYWORDS, DYNAMIC_KEYWORDS);

const description =
  "URL shortener, PDF tools, image converters, text utilities, developer helpers, and calculators — all in one place.";
const smartDescription = description || siteDescriptionFallback(ToolsData);

const siteURL = process.env.NEXT_PUBLIC_SITE_URL || "toolshub.dev";

export const metadata: Metadata = {
  title: {
    default: "Tools Hub — Fast, Free, Privacy-Friendly Online Tools",
    template: "%s • Tools Hub",
  },
  description: smartDescription,
  metadataBase: new URL(siteURL),
  keywords: KEYWORDS,
  authors: [{ name: "Tariqul Islam", url: "https://tariqul.dev" }],
  creator: "Tariqul Islam",
  publisher: "Tariqul Islam",
  category: "UtilitiesApplication",
  applicationName: "Tools Hub",
  appLinks: {
    web: {
      url: `${siteURL}`,
    },
  },
  openGraph: {
    title: "Tools Hub — Fast, Free, Privacy-Friendly Online Tools",
    description:
      "Fast, free, privacy-friendly online tools. Shorten links, convert files, optimize images, and more.",
    type: "website",
    url: `${siteURL}/tools`,
    siteName: "Tools Hub",
    locale: "en_US",
    alternateLocale: ["bn_BD"],
    images: [
      {
        url: `${siteURL}/og/tools-hub-og.png`,
        width: 1200,
        height: 630,
        alt: "Tools Hub",
      },
      {
        url: `${siteURL}/og/tools-hub-square.png`,
        width: 800,
        height: 800,
        alt: "Tools Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@toolshub",
    creator: "@toolshub",
    title: "Tools Hub — Fast, Free, Privacy-Friendly Online Tools",
    description:
      "Shorten links, convert files, optimize images, and more. 100% free and privacy-first.",
    images: [`${siteURL}/og/tools-hub-og.png`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: `${siteURL}/tools`,
    languages: {
      "en-US": `${siteURL}/tools`,
      "bn-BD": `${siteURL}/bn/tools`,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/icons/safari-pinned-tab.svg", color: "#0ea5e9" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tools Hub",
    url: siteURL,
    inLanguage: ["en", "bn"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteURL}/search?q={query}`,
      "query-input": "required name=query",
    },
  };

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tools Hub",
    url: siteURL,
    logo: `${siteURL}/og/tools-hub-square.png`,
    sameAs: [
      "https://tariqul.dev",
      "https://github.com/tariqul420",
      "https://linkedin.com/tariqul-dev",
    ],
  };

  // Structured list of categories to help discovery
  const navLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tools Hub Categories",
    itemListElement: ToolsData.map((c, i: number) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.title,
      url: `${siteURL}${c.url}`,
    })),
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <JsonLd data={siteLd} />
        <JsonLd data={orgLd} />
        <JsonLd data={navLd} />
        <main className="mx-auto px-4">{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
