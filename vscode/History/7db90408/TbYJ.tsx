import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: 'About — Tools Hub',
  description: 'Learn about Tools Hub — our mission is to provide fast, free, privacy-friendly online utilities.',
};

export default function AboutPage() {
  return (
    <main className="py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">About Tools Hub</h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        Tools Hub brings essential online utilities together — URL shortener, PDF & image tools, text utilities, developer helpers, and calculators — with a focus on speed, simplicity, and privacy.
      </p>

      <Separator className="my-6" />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>What we value</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Speed & usability first</p>
            <p>• Minimal data collection</p>
            <p>• Free & accessible tooling</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tech we use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Next.js (App Router), TypeScript</p>
            <p>• ShadCN UI, TailwindCSS</p>
            <p>• Prisma + PostgreSQL (for shortener)</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
