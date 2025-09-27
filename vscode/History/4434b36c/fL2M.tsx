// app/tools/(tools)/url/shortener/page.tsx
import ShortenerClient from '@/components/tools/url/shortener/shortener-client';
import { GlassCard } from '@/components/ui/glass-card';
import { Link2 } from 'lucide-react';

export const metadata = {
  title: 'URL Shortener • Tools Hub',
  description: 'Paste a link and get the shortest possible domain/slug. Anonymous by default. If a URL was shortened before, you’ll get the same short link.',
};

export default function Page() {
  return (
    <div className="space-y-4">
      {/* Header (server-safe) */}
      <GlassCard className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 py-5">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Link2 className="h-6 w-6" />
            URL Shortener
          </h1>
          <p className="text-sm text-muted-foreground">Paste a link and get the shortest possible domain/slug. Anonymous by default. If a URL was shortened before, you’ll get the same short link.</p>
        </div>
      </GlassCard>

      {/* Interactive client part */}
      <ShortenerClient />
    </div>
  );
}
