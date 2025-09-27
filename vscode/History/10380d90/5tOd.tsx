'use client';

import PricingCards from '@/components/root/pricing-cards';
import { Button } from '@/components/ui/button';
import { CalendarDays, Users2, Video } from 'lucide-react';
import { useEffect, useState } from 'react';

const testimonials = [
  {
    quote: 'Meetora transformed our hiring process and boosted team collaboration.',
    author: 'Sarah L., Product Lead',
    image: '/assets/sarah-l.png',
  },
  {
    quote: 'Scheduling and video interviews are now effortless and fast.',
    author: 'John D., HR Manager',
    image: '/assets/john-d.png',
  },
  {
    quote: 'I love how easy it is to share feedback with my team in real time.',
    author: 'Emily K., Recruitment Specialist',
    image: '/assets/emily-k.png',
  },
];

export default function HomePage() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-28 px-6 mt-10 rounded-md">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Smarter Interviews. <br /> Better Hiring.
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Conduct structured, unbiased interviews with built-in video, scheduling, and collaboration — all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5 mt-8">
              <Button size="lg">Get Started Free</Button>
              <Button variant="outline" size="lg" className="border-primary text-primary-foreground hover:bg-primary/20">
                Book a Demo
              </Button>
            </div>
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
        <section className="bg-muted/50 py-20 px-6">
          <h2 className="text-4xl font-bold text-center mb-14">How It Works</h2>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-16 text-center">
            <Step number={1} title="Schedule" description="Add candidates, select time slots, and generate interview links." />
            <Step number={2} title="Interview" description="Conduct video interviews with built-in notes and timers." />
            <Step number={3} title="Evaluate" description="Collect feedback instantly from your team, all in one place." />
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-4xl mx-auto text-center py-20 px-6">
          <h2 className="text-4xl font-bold mb-10">What Our Users Say</h2>
          <blockquote className="italic text-lg text-muted-foreground">“{testimonials[testimonialIndex].quote}”</blockquote>
          <p className="mt-4 font-semibold">{testimonials[testimonialIndex].author}</p>
          <div className="mt-6 flex justify-center space-x-4">
            {testimonials.map((_, i) => (
              <button
                key={i}
                aria-label={`Show testimonial ${i + 1}`}
                className={`w-3 h-3 rounded-full transition-colors ${i === testimonialIndex ? 'bg-primary' : 'bg-muted-foreground'}`}
                onClick={() => setTestimonialIndex(i)}
              />
            ))}
          </div>
        </section>

        {/* Pricing Teaser */}
        <section className="bg-background py-20">
          <div className="max-w-6xl mx-auto text-center space-y-6">
            <h2 className="text-5xl font-bold">Simple Pricing</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Transparent plans for teams of any size. Try Meetora free for 14 days.</p>
            <PricingCards />
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-primary text-primary-foreground py-24 px-6 text-center rounded-t-3xl shadow-md shadow-primary/30">
          <h2 className="text-3xl font-semibold mb-4">Stay Updated</h2>
          <p className="max-w-xl mx-auto mb-10 opacity-90 leading-relaxed">Subscribe to our newsletter to receive the latest Meetora updates, tips, and exclusive offers directly in your inbox.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thanks for subscribing!');
            }}
            className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              required
              placeholder="Your email address"
              className="flex-grow rounded-md border border-input bg-background px-5 py-4 text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition"
            />
            <Button type="submit" className="font-semibold px-8 py-4 shadow-md hover:shadow-lg transition">
              Subscribe
            </Button>
          </form>
        </section>

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
      </main>
    </div>
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

// Step Component for How it Works
function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div>
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4 mx-auto">{number}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mx-auto">{description}</p>
    </div>
  );
}
