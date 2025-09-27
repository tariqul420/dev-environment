// lib/seo.ts
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://naturalsefaa.com';
const SITE_NAME = 'Tools Hub • Natural Sefa';
const SITE_TWITTER = '@naturalsefaa'; // change if you have a different handle
const DEFAULT_IMAGE = `${SITE_URL}/og/tools-hub-og.png`; // place an OG image at this path

type BuildMetaInput = {
  title: string;
  description: string;
  path: string; // canonical path: e.g. "/tools/url/shortener"
  keywords?: string[];
  image?: string; // optional custom OG image for the page
};

export function buildMetadata(input: BuildMetaInput): Metadata {
  const url = new URL(input.path, SITE_URL).toString();
  const image = input.image ?? DEFAULT_IMAGE;

  return {
    // Core
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    category: 'Utilities',

    // Canonical
    alternates: { canonical: url },

    // Robots
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },

    // Open Graph
    openGraph: {
      type: 'website',
      url,
      siteName: SITE_NAME,
      title: input.title,
      description: input.description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: input.title,
        },
      ],
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: SITE_TWITTER,
      creator: SITE_TWITTER,
      title: input.title,
      description: input.description,
      images: [image],
    },

    // App Links / misc
    // icons: { icon: "/favicon.ico", shortcut: "/favicon.ico", apple: "/apple-touch-icon.png" },

    // Other helpful hints
    other: {
      'og:locale': 'en_US',
    },
  };
}
