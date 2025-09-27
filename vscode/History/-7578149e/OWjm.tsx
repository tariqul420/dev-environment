import JsonLd from '@/components/seo/json-ld';
import ClipboardCleanerClient from '@/components/tools/util/clipboard-cleaner-client';

import { Button } from '@/components/ui/button';
import { GlassCard, MotionGlassCard } from '@/components/ui/glass-card';
import { Separator } from '@/components/ui/separator';
import { buildMetadata } from '@/lib/seo';
import { ClipboardType, RotateCcw } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Clipboard Cleaner • Tools Hub',
  description: 'Strip formatting and paste as plain text. Clean punctuation, spaces, emojis, URLs & more. Paste, clean, and copy in one click.',
  path: '/tools/util/clipboard-cleaner',
  keywords: ['clipboard cleaner', 'plain text paste', 'remove formatting', 'strip emojis', 'remove URLs', 'clean text', 'Tools Hub'],
});

export default function Page() {
  const site = process.env.NEXT_PUBLIC_SITE_URL;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Clipboard Cleaner — Tools Hub',
    url: `${site}/tools/util/clipboard-cleaner`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    description: 'Strip formatting and paste as plain text. Clean smart punctuation, spaces, emojis, and URLs with one click.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: ['Paste & clean text instantly', 'Remove formatting, URLs, emojis', 'Fix smart quotes/dashes/ellipsis', 'Auto-clean on paste option', 'Copy/export cleaned text'],
    creator: {
      '@type': 'Person',
      name: 'Tariqul Islam',
      url: 'https://tariqul.dev',
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
              <ClipboardType className="h-6 w-6" /> Clipboard Cleaner
            </h1>
            <p className="text-sm text-muted-foreground">Strip formatting & paste as plain text. Clean punctuation, spaces, emojis & more.</p>
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
      <ClipboardCleanerClient />
    </div>
  );
}
