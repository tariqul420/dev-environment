import JsonLd from '@/components/seo/json-ld';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'ISO Week Number • Tools Hub',
  description:
    'Find the ISO week number, ISO week-year, and the Monday–Sunday date range for any date. DST-safe, fast, and copy-friendly.',
  path: '/tools/time/weekno',
  keywords: ['ISO week', 'week number', 'week of year', 'date range', 'calendar', 'Tools Hub'],
});

export default function Page() {
  const site = process.env.NEXT_PUBLIC_SITE_URL;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ISO Week Number — Tools Hub',
    url: `${site}/tools/time/weekno`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    description:
      'Calculate ISO week number, ISO week-year, and the Monday–Sunday range for any date with copy/share tools.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: ['Today/Reset controls', 'Copy results', 'ISO week-year', 'Date range (Mon–Sun)'],
    creator: {
      '@type': 'Organization',
      name: 'Tools Hub',
      url: site,
    },
  };

  return (
    <div className="space-y-4">
      <JsonLd data={jsonLd} />
      {/* Interactive client component */}
      {/* If you prefer colocated code, paste the WeekNumberClient code below into /components/tools/time/weekno-client.tsx and adjust the import */}
      <WeekNumberClient />
    </div>
  );
}

/* ----------------------------------------------------------------------
 * Inline client component for convenience.
 * If you keep this inline, ensure your bundler allows client components in page files.
 * Recommended: move to `@/components/tools/time/weekno-client.tsx` and import instead.
 * -------------------------------------------------------------------- */

'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard, MotionGlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calendar, Check, Copy, RefreshCcw, RotateCcw } from 'lucide-react';

/** ------------------------------ Helpers ------------------------------ **/

const pad = (n: number, w = 2) => n.toString().padStart(w, '0');
const fmtYMD = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function parseYMD(ymd
