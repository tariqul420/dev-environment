import { Button } from '@/components/ui/button';
import { MotionGlassCard } from '@/components/ui/glass-card';

import { notFound } from 'next/navigation';

export default async function InterstitialPage({ params }: { params: { id: string } }) {
  const link = await getLink(params.id);
  if (!link) notFound();

  async function continueAction() {
    'use server';
    await recordClickAndRedirect(params.id);
  }

  const url = new URL(link.targetUrl);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <MotionGlassCard className="p-6">
        <div className="text-sm text-muted-foreground">You are about to visit</div>
        <div className="mt-1 truncate text-2xl font-semibold">{link.targetUrl}</div>
        <div className="mt-2 text-xs text-muted-foreground">
          Domain: <span className="font-medium">{url.hostname}</span>
        </div>

        <form action={continueAction} className="mt-6 flex gap-2">
          <Button type="submit">Continue</Button>
          <a href="/url/shortener" className="inline-flex items-center rounded-md border px-3 py-2 text-sm">
            Make another
          </a>
        </form>
      </MotionGlassCard>
    </div>
  );
}
