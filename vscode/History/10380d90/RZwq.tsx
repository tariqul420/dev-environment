'use client';

import HowItWork from '@/components/root/home/how-it-work';
import NewsletterSection from '@/components/root/home/newsletter-section';
import TestimonialSection from '@/components/root/home/testimonial-section';
import PricingCards from '@/components/root/pricing-cards';
import { Button } from '@/components/ui/button';
import { CalendarDays, Users2, Video } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-28 px-6 mt-10 rounded-md">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Smarter Interviews. <br /> Better Hiring.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Conduct structured, unbiased interviews with built-in video, scheduling, and collaboration — all in one platform.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5 mt-8 flex-wrap">
            <Button size="lg" variant="outline">
              Get Started Free
            </Button>
            <Button variant="outline" size="lg">
              Book a Demo
            </Button>
          </div>
          {/* EduGenius Button */}
          <Link href="https://edugenius.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-flex">
            <Button size="lg" variant="secondary">
              Explore EduGenius
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <h2 className="text-4xl font-semibold text-center mb-16">Why Meetora?</h2>
        <div className="grid md:grid-cols-3 gap-14 text-center">
          <FeatureCard icon={<Video className="mx-auto mb-4 w-12 h-12 text-primary" />} title="Built-In Video">
            Conduct interviews directly in your browser — no downloads or plugins needed.
          </FeatureCard>
          <FeatureCard icon={<CalendarDays className="mx-auto mb-4 w-12 h-12 text-primary" />} title="Smart Scheduling">
            Auto detect time zones, sync calendars, and send automatic reminders.
          </FeatureCard>
          <FeatureCard icon={<Users2 className="mx-auto mb-4 w-12 h-12 text-primary" />} title="Team Collaboration">
            Share notes, feedback, and evaluate candidates together in real time.
          </FeatureCard>
        </div>
      </section>

      {/* How It Works */}
      <HowItWork />

      {/* Pricing Teaser */}
      <section className="bg-background py-20">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <h2 className="text-5xl font-bold">Simple Pricing</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Transparent plans for teams of any size. Try Meetora free for 14 days.</p>
          <PricingCards />
        </div>
      </section>

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* Newsletter Signup */}
      <NewsletterSection />

      {/* Call to Action */}
      <section className="py-24 px-6 bg-muted/80 text-center rounded-b-3xl shadow-inner shadow-muted/50">
        <h2 className="text-4xl font-extrabold mb-5">Ready to Hire Smarter?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-lg leading-relaxed">
          Join thousands of teams using Meetora for structured, remote-first interviews. Simplify your hiring workflow today.
        </p>
        <Button size="lg" className="px-10 py-5 shadow-lg hover:shadow-xl transition">
          Create Your Free Account
        </Button>
      </section>
    </>
  );
}

// FeatureCard Component
function FeatureCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl p-8 shadow hover:shadow-lg transition-shadow cursor-default">
      {icon}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{children}</p>
    </div>
  );
}
