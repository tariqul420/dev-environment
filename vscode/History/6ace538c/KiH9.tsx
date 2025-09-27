'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NewsletterSection() {
  return (
    <section className="bg-primary text-primary-foreground py-24 px-6 text-center rounded-t-3xl shadow-md shadow-primary/30">
      <h2 className="text-3xl font-semibold mb-4">Stay Updated</h2>
      <p className="max-w-xl mx-auto mb-10 opacity-90 leading-relaxed">Subscribe to our newsletter to receive the latest Meetora updates, tips, and exclusive offers directly in your inbox.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert('Thanks for subscribing!');
        }}
        className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
        <Input type="email" required placeholder="Your email address" />
        <Button type="submit" variant={'outline'}>
          Subscribe
        </Button>
      </form>
    </section>
  );
}
