import JsonLd from '@/components/seo/json-ld';
import TimeZoneConverterClient from '@/components/tools/time/timezone-converter-client';
import { Button } from '@/components/ui/button';
import { GlassCard, MotionGlassCard } from '@/components/ui/glass-card';
import { Separator } from '@/components/ui/separator';
import { buildMetadata } from '@/lib/seo';
import { Globe2, RotateCcw } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Time Zone Converter • Tools Hub',
  description: 'Convert time across cities and countries with ease. Instantly compare different time zones and copy/share results.',
  path: '/tools/time/timezone',
  keywords: ['time zone converter', 'world clock', 'city time', 'convert time', 'timezone comparison', 'Tools Hub'],
});

export default function Page() {
  const site = process.env.NEXT_PUBLIC_SITE_URL;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Time Zone Converter — Tools Hub',
    url: `${site}/tools/time/timezone`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    description: 'Convert time between different cities and time zones. Easily copy and share converted times.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: ['Search & pick cities', 'Compare multiple time zones', 'DST aware conversion', 'Copy/share results'],
    creator: {
      '@type': 'Organization',
      name: 'Tools Hub',
      url: site,
    },
  };

  return (
    <div className="space-y-4">
      <JsonLd data={jsonLd} />

      {/* Flowing header card */}
      <MotionGlassCard>
        <GlassCard className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <Globe2 className="h-6 w-6" /> Time Zone Converter
            </h1>
            <p className="text-sm text-muted-foreground">Convert time across cities and countries. DST-aware and easy to copy/share.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
        </GlassCard>
      </MotionGlassCard>

      <Separator />

      {/* Interactive client component */}
      <TimeZoneConverterClient />
    </div>
  );
}
