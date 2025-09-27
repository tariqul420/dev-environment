import JsonLd from '@/components/seo/json-ld';
import RandomPickerClient from '@/components/tools/util/random-picker-client';
import { GlassCard, MotionGlassCard } from '@/components/ui/glass-card';
import { Separator } from '@/components/ui/separator';
import { buildMetadata } from '@/lib/seo';
import { Shuffle } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Random Picker • Tools Hub',
  description: 'Pick a random winner from a list of names. Perfect for giveaways, raffles, classroom activities, and more. Fast, fair, and free.',
  path: '/tools/util/random-picker',
  keywords: ['random picker', 'pick winner', 'raffle tool', 'giveaway tool', 'random name selector', 'online picker', 'Tools Hub'],
});

export default function Page() {
  const site = process.env.NEXT_PUBLIC_SITE_URL;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Random Picker — Tools Hub',
    url: `${site}/tools/util/random-picker`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    description: 'Enter a list of names and pick a random winner instantly. Ideal for raffles, giveaways, team selection, and classroom activities.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: ['Paste or type names', 'One-click random selection', 'Highlight the winner', 'No ads, free forever'],
    creator: {
      '@type': 'Person',
      name: 'Tariqul Islam',
      url: 'https://tariqul.dev',
    },
  };

  return (
    <div className="space-y-4">
      <JsonLd data={jsonLd} />

      {/* Flowing header */}
      <MotionGlassCard>
        <GlassCard className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <Shuffle className="h-6 w-6" /> Random Picker
            </h1>
            <p className="text-sm text-muted-foreground">Paste names and pick a random winner instantly. Perfect for raffles, giveaways, or team selection.</p>
          </div>
        </GlassCard>
      </MotionGlassCard>

      <Separator />

      {/* Interactive client component */}
      <RandomPickerClient />
    </div>
  );
}
