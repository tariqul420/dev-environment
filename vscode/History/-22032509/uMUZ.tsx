import JsonLd from '@/components/seo/json-ld';
import AgeCalculatorClient from '@/components/tools/time/age-client';
import { Button } from '@/components/ui/button';
import { GlassCard, MotionGlassCard } from '@/components/ui/glass-card';
import { Separator } from '@/components/ui/separator';
import { buildMetadata } from '@/lib/seo';
import { CalendarClock, RotateCcw } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Age Calculator • Tools Hub',
  description: 'Instantly calculate exact age from date of birth — years, months, days, next birthday, and more. Copy-friendly and timezone-safe.',
  path: '/tools/time/age',
  keywords: ['age calculator', 'date of birth', 'DOB to age', 'years months days', 'next birthday', 'Tools Hub'],
});

export default function Page() {
  const site = process.env.NEXT_PUBLIC_SITE_URL;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Age Calculator — Tools Hub',
    url: `${site}/tools/time/age`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    description: 'Calculate precise age from date of birth with years, months, days, and next birthday details. Copy/share results easily.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: ['DOB picker & Today shortcut', 'Exact years, months, days', 'Next birthday & weekday', 'Copy & share results'],
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
              <CalendarClock className="h-6 w-6" /> Age Calculator
            </h1>
            <p className="text-sm text-muted-foreground">Years, months, days from your date of birth — plus next birthday insights.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Hook these buttons up via AgeCalculatorClient actions if desired */}
            <Button variant="outline" className="gap-2" aria-label="Reset">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
        </GlassCard>
      </MotionGlassCard>

      <Separator />

      {/* Interactive client component */}
      <AgeCalculatorClient />
    </div>
  );
}
