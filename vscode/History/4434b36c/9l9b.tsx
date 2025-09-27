// app/tools/(tools)/url/shortener/page.tsx
import JsonLd from '@/components/seo/json-ld';
import ShortenerClient from '@/components/tools/url/shortener/shortener-client';
import { ToolsHeader } from '@/components/ui/tools-header';
import { buildMetadata } from '@/lib/seo';
import { Link2 } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'URL Shortener • Tools Hub',
  description: 'Paste a link and get the shortest possible domain/slug. Anonymous by default. If a URL was shortened before, you’ll get the same short link.',
  path: '/tools/url/shortener',
  keywords: ['URL shortener', 'link shortener', 'short link', 'short URL generator', 'UTM shortener', 'custom slug', 'link analytics', 'QR code link', 'Bangladesh', 'Tools Hub'],
});

export default function Page() {
  // Optional: JSON-LD (structured data) for this tool
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'URL Shortener — Tools Hub',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://toolshub.com'}/tools/url/shortener`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    description: 'Shorten URLs with custom slugs, analytics, and QR code export. Fast, secure, and free.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: ['Custom slug', 'Link analytics', 'Interstitial page', 'Built-in QR code', 'SVG/PNG QR export'],
    creator: {
      '@type': 'Organization',
      name: 'Natural Sefa',
      url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://naturalsefaa.com',
    },
  };

  return (
    <div className="space-y-4">
      {/* Server-safe header using your reusable ToolsHeader (no actions here) */}
      <ToolsHeader icon={Link2} title="URL Shortener" description="Shorten links with custom slugs & analytics" />

      {/* JSON-LD */}
      <JsonLd data={jsonLd} />

      {/* Interactive client part */}
      <ShortenerClient />
    </div>
  );
}
