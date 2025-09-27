import JsonLd from '@/components/seo/json-ld';
import IdGeneratorClient from '@/components/tools/util/id-generator-client';
import { GlassCard, MotionGlassCard } from '@/components/ui/glass-card';
import { Separator } from '@/components/ui/separator';
import { buildMetadata } from '@/lib/seo';
import { Fingerprint } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'GUID / Order ID Generator • Tools Hub',
  description: 'Generate random GUIDs, UUIDs, and readable short Order IDs instantly. Copy-friendly, secure, and free to use.',
  path: '/tools/util/id-generator',
  keywords: ['GUID generator', 'UUID generator', 'order ID generator', 'short ID', 'unique ID', 'random ID', 'Tools Hub'],
});

export default function Page() {
  const site = process.env.NEXT_PUBLIC_SITE_URL;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'GUID / Order ID Generator — Tools Hub',
    url: `${site}/tools/util/id-generator`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    description: 'Generate globally unique identifiers (GUIDs/UUIDs) or human-friendly order IDs. Copy, regenerate, and export with ease.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: ['Generate UUID v4 / GUID', 'Readable short Order IDs', 'One-click copy', 'Batch generation & export'],
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
              <Fingerprint className="h-6 w-6" /> GUID / Order ID Generator
            </h1>
            <p className="text-sm text-muted-foreground">Generate secure UUIDs or simple order IDs instantly. Copy or export with one click.</p>
          </div>
        </GlassCard>
      </MotionGlassCard>

      <Separator />

      {/* Interactive client component */}
      <IdGeneratorClient />
    </div>
  );
}
