'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Get in Touch</h1>
        <p className="text-muted-foreground">Have a question, partnership idea, or feedback? We’d love to hear from you.</p>
      </section>

      <form className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Your Name
          </label>
          <Input id="name" placeholder="Jane Doe" required />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Your Email
          </label>
          <Input type="email" id="email" placeholder="you@example.com" required />
        </div>
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">
            Message
          </label>
          <Textarea id="message" placeholder="How can we help you?" rows={6} required />
        </div>
        <Button type="submit" className="w-full">
          Send Message
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Or email us directly at{' '}
        <a className="underline" href="mailto:support@meetora.app">
          support@meetora.app
        </a>
      </div>
    </div>
  );
}
