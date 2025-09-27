'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-background py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold">Let’s connect 👋</h1>
          <p className="text-muted-foreground text-lg">Whether you have a question about features, pricing, demo, or anything else — our team is ready to answer.</p>
        </section>

        {/* Main Contact Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* Left: Contact Info */}
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Contact Information</h2>
              <p className="text-muted-foreground">Feel free to reach out directly or through the form.</p>

              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>support@meetora.app</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+880 123-456-7890</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Dhaka, Bangladesh</span>
                </li>
              </ul>
            </div>

            {/* Google Maps Embed Placeholder */}
            <div className="rounded-xl overflow-hidden border border-border h-64">
              <iframe
                title="Meetora Location"
                src="https://maps.google.com/maps?q=Dhaka,%20Bangladesh&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full grayscale contrast-125 dark:brightness-75"
                loading="lazy"
              />
            </div>

            <div className="bg-muted/60 p-6 rounded-xl text-center">
              <h3 className="text-lg font-semibold mb-2">Prefer email?</h3>
              <p className="text-sm text-muted-foreground">
                Send us a message at{' '}
                <a href="mailto:support@meetora.app" className="underline">
                  support@meetora.app
                </a>
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <form className="space-y-6 bg-card p-8 rounded-2xl border shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">Send Us a Message</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </label>
                <Input id="firstName" placeholder="Jane" required />
              </div>

              <div className="space-y-1">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </label>
                <Input id="lastName" placeholder="Doe" required />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input type="email" id="email" placeholder="you@example.com" required />
            </div>

            <div className="space-y-1">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input id="subject" placeholder="e.g. Bug report, Pricing, Help..." />
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="text-sm font-medium">
                Your Message
              </label>
              <Textarea id="message" rows={6} placeholder="Write your message here..." required />
            </div>

            <Button size="lg" className="w-full mt-4">
              <Send className="mr-2 w-4 h-4" />
              Send Message
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
