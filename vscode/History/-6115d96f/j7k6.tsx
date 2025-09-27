'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlassCard, MotionGlassCard } from '@/components/ui/glass-card';
import { getLink, recordClickAndRedirect } from '@/lib/actions/shortener';
import { CheckCircle2, Copy, ExternalLink, Link as LinkIcon, Lock, ShieldCheck, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import * as React from 'react';

/* ----------------------------- Server Component ---------------------------- */

export default async function InterstitialPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const link = await getLink(id);
  if (!link) notFound();

  async function continueAction() {
    'use server';
    await recordClickAndRedirect(params.id);
  }

  const target = new URL(link.targetUrl);
  const hostname = target.hostname;
  const pathAndQuery = `${target.pathname}${target.search}`;
  const isHttps = target.protocol === 'https:';
  const tld = hostname.split('.').slice(-1)[0]?.toUpperCase() || '';
  const analyticsHref = `/tools/url/shortener/analytics/${params.id}`;
  const createdAt = new Date(link.createdAt).toLocaleString();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <MotionGlassCard className="overflow-hidden">
        {/* Top banner */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border bg-background/50 backdrop-blur">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={`${hostname} favicon`} src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <LinkIcon className="h-3.5 w-3.5" />
                    Destination preview
                  </Badge>
                  {isHttps ? (
                    <Badge className="gap-1">
                      <Lock className="h-3.5 w-3.5" />
                      HTTPS
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <TriangleAlert className="h-3.5 w-3.5" />
                      Not HTTPS
                    </Badge>
                  )}
                  {tld && <Badge variant="outline">{tld}</Badge>}
                </div>
                <div className="mt-1 truncate text-xl font-semibold leading-tight">{hostname}</div>
                <div className="truncate text-xs text-muted-foreground">{pathAndQuery || '/'}</div>
              </div>
            </div>

            <Link href={analyticsHref} className="text-sm underline underline-offset-4">
              View analytics
            </Link>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Full URL + actions */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-xs text-muted-foreground">Full URL</div>
                <code className="mt-1 block max-w-[58ch] truncate rounded-md bg-muted px-2 py-1 text-sm">{link.targetUrl}</code>
              </div>
              <form
                action={async () => {
                  'use server';
                  // no-op on server; copy is client-only, so we render a client button below
                }}>
                {/* placeholder to keep layout consistent */}
              </form>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {/* Client copy button */}
              <CopyUrlButton url={link.targetUrl} />
              <Button asChild variant="outline" className="gap-2">
                <a href={link.targetUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Open without tracking
                </a>
              </Button>
            </div>
          </GlassCard>

          {/* Safety notes + meta */}
          <div className="grid gap-3 sm:grid-cols-2">
            <GlassCard className="p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <ShieldCheck className="h-4 w-4" />
                Quick safety checks
              </div>
              <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                <li>Confirm the domain matches what you expect.</li>
                <li>{isHttps ? 'HTTPS is present.' : 'No HTTPS — avoid entering passwords.'}</li>
                <li>Be careful with downloads and unfamiliar forms.</li>
              </ul>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="mb-2 text-sm font-medium">Link details</div>
              <div className="text-xs text-muted-foreground">
                Short ID: <span className="font-medium">{params.id}</span>
                <br />
                Created: <span className="font-medium">{createdAt}</span>
              </div>
              <div className="mt-3 text-xs">
                <Link href="/tools/url/shortener" className="inline-flex items-center gap-2 underline underline-offset-4 hover:text-foreground">
                  Make another short link
                </Link>
              </div>
            </GlassCard>
          </div>

          {/* Continue CTA with countdown/consent */}
          <ContinueForm action={continueAction} host={hostname} />
        </div>
      </MotionGlassCard>
    </div>
  );
}

/* ----------------------------- Client Components ---------------------------- */

function CopyUrlButton({ url }: { url: string }) {
  'use client';
  const [copied, setCopied] = React.useState(false);
  return (
    <Button
      type="button"
      className="gap-2"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1000);
        } catch {}
      }}>
      {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? 'Copied' : 'Copy URL'}
    </Button>
  );
}

function ContinueForm({ action, host }: { action: (formData: FormData) => Promise<void>; host: string }) {
  'use client';
  const [agree, setAgree] = React.useState(false);
  const [left, setLeft] = React.useState(3); // seconds
  const canSubmit = agree && left === 0;

  React.useEffect(() => {
    if (left === 0) return;
    const t = setTimeout(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
  }, [left]);

  return (
    <GlassCard className="p-4">
      <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          You’re about to continue to <span className="font-medium text-foreground">{host}</span>.
        </div>

        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <label className="inline-flex items-center gap-2 text-xs">
            <input type="checkbox" className="h-4 w-4 accent-primary" checked={agree} onChange={(e) => setAgree(e.target.checked)} />I trust this site
          </label>

          <Button type="submit" disabled={!canSubmit} className="gap-2">
            Continue {left > 0 && `(${left})`}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
