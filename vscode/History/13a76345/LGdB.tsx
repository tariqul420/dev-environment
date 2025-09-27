import Link from "next/link";
import { Compass, Home, RefreshCcw, Search, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

/*
  Tools Hub — Not Found
  ------------------------------------------------------------------
  Place this file at: app/not-found.tsx (App Router)
  If you insist on using page.tsx for a custom 404 route, you can also
  put this under: app/(marketing)/404/page.tsx and link to /404.
  Uses ONLY ShadCN UI components.
*/

export default function NotFound() {
  return (
    <main className="relative mx-auto flex min-h-[85svh] w-full max-w-3xl flex-col items-center px-4 py-16">
      {/* Decorative soft auras */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[oklch(var(--primary)/0.12)] blur-3xl" />
      </div>

      {/* Header */}
      <div className="text-center">
        <Badge variant="secondary" className="inline-flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5" /> 404 — Page not found
        </Badge>
        <h1 className="mt-3 text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          We can't find that page.
        </h1>
        <p className="mx-auto mt-2 max-w-prose text-pretty text-muted-foreground">
          It may have been moved, deleted, or the URL might be incorrect. Try searching or browse
          the tools.
        </p>
      </div>

      {/* Search & actions */}
      <Card className="mt-8 w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Search Tools</CardTitle>
          <CardDescription>Find a tool by name or keyword</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form action="/tools/search" method="GET" className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
              <Input
                name="q"
                placeholder="e.g. JSON formatter, QR code, PDF to image, BMI"
                className="pl-9"
                aria-label="Search tools"
                required
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <Separator />

          {/* Quick categories */}
          <div className="grid gap-2 sm:grid-cols-2">
            <QuickLink
              href="/tools"
              label="Browse all tools"
              icon={<Compass className="h-4 w-4" />}
            />
            <QuickLink
              href="/tools/categories"
              label="View categories"
              icon={<RefreshCcw className="h-4 w-4" />}
            />
            <QuickLink href="/tools/url" label="URL Tools" />
            <QuickLink href="/tools/text" label="Text Tools" />
            <QuickLink href="/tools/image" label="Image Tools" />
            <QuickLink href="/tools/pdf" label="PDF Tools" />
            <QuickLink href="/tools/calc" label="Calculators" />
            <QuickLink href="/tools/seo" label="SEO Tools" />
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button asChild>
              <Link href="/tools">
                <Compass className="mr-2 h-4 w-4" /> Explore Tools
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Helpful links */}
      <div className="mt-8 grid w-full gap-3 sm:grid-cols-3">
        <MiniCard title="About" desc="What is Tools Hub?" href="/about" />
        <MiniCard title="Sponsor" desc="Support development" href="/sponsor" />
        <MiniCard title="Contact" desc="Report a broken link" href="/contact" />
      </div>
    </main>
  );
}

function QuickLink({ href, label, icon }: { href: string; label: string; icon?: React.ReactNode }) {
  return (
    <Button asChild variant="outline" className="justify-start">
      <Link href={href} className="inline-flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </Link>
    </Button>
  );
}

function MiniCard({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Card className="bg-card/70">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild size="sm" variant="secondary">
          <Link href={href}>Open</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
