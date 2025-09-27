import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: 'Terms of Service — Tools Hub',
  description: 'Terms and acceptable use for Tools Hub.',
};

export default function TermsPage() {
  return (
    <main className="py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Terms of Service</h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">By using Tools Hub, you agree to the terms below. Please read them carefully.</p>

      <Separator className="my-6" />

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Acceptable use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• Do not misuse tools for spam, malware, or illegal content.</p>
          <p>• Respect rate limits and service integrity.</p>
          <p>• We may throttle or suspend abusive usage.</p>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• Tools are provided “as is”, without warranties of any kind.</p>
          <p>• We are not liable for any damages from using the service.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• For questions: legal@your-domain.com</p>
          <p>• Last updated: {new Date().toISOString().slice(0, 10)}</p>
        </CardContent>
      </Card>
    </main>
  );
}
