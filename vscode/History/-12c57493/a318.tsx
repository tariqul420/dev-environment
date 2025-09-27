import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: 'Privacy Policy — Tools Hub',
  description: 'Our commitment to privacy and data handling practices.',
};

export default function PrivacyPage() {
  return (
    <main className="py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Privacy Policy</h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">We design Tools Hub to be privacy-friendly. This page explains what we collect and how we use it.</p>

      <Separator className="my-6" />

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Data we may process</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• Anonymous usage metrics to improve reliability.</p>
          <p>• For URL shortener: hashed IP / user-agent for anti-abuse analytics.</p>
          <p>• No sale of personal data. No tracking cookies for tool usage.</p>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Third-party services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• Analytics & error monitoring (aggregate, non-identifying when possible).</p>
          <p>• Optional: Ad networks may set their own cookies per their policies.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your choices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• You may avoid optional features requiring account login.</p>
          <p>• You can request removal of any account-bound data you control.</p>
          <p>• Contact us for privacy requests: support@your-domain.com</p>
        </CardContent>
      </Card>
    </main>
  );
}
