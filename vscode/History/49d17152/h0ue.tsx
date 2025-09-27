'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sparkles } from 'lucide-react';

const team = [
  {
    name: 'Tariqul Islam',
    role: 'Founder & Full Stack Engineer',
    image: '/avatars/tariqul.jpg',
  },
  {
    name: 'Sarah Lin',
    role: 'Product Designer',
    image: '/avatars/sarah.jpg',
  },
  {
    name: 'Jason Roy',
    role: 'AI/ML Engineer',
    image: '/avatars/jason.jpg',
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20 space-y-20">
      {/* Hero */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-primary font-medium text-sm">
          <Sparkles className="w-4 h-4" />
          Empowering smarter interviews
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">About Meetora</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">We help companies streamline the hiring process through structured, smart, and human-centered video interviews.</p>
        <Button size="lg" className="mt-4">
          Try Meetora
        </Button>
      </section>

      {/* Story */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            Meetora was founded to solve a real frustration — video interviews were clunky, inconsistent, and impersonal. Our team built a platform that puts both the recruiter and candidate
            experience first. From scheduling to evaluation, Meetora creates a seamless flow that helps teams hire smarter and faster.
          </p>
        </div>
        <img src="/images/about-illustration.svg" alt="Interview process illustration" className="w-full h-auto rounded-xl border" />
      </section>

      <Separator />

      {/* Values */}
      <section className="text-center space-y-10">
        <h2 className="text-2xl font-semibold">Why We Built Meetora</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold">Remote-First Friendly</h3>
            <p className="text-muted-foreground">Designed for global, async teams who need to interview across time zones.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Smart & Structured</h3>
            <p className="text-muted-foreground">Evaluation tools, scorecards, and insights baked into your workflow.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Built for Candidates</h3>
            <p className="text-muted-foreground">No installs. Just a browser. A frictionless experience for every interviewee.</p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {team.map(({ name, role, image }) => (
            <div key={name} className="flex flex-col items-center space-y-3">
              <Avatar className="w-20 h-20 ring-2 ring-primary">
                <AvatarImage src={image} alt={name} />
                <AvatarFallback>{name[0]}</AvatarFallback>
              </Avatar>
              <div className="font-medium">{name}</div>
              <div className="text-sm text-muted-foreground">{role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted rounded-xl p-10 text-center space-y-4">
        <h3 className="text-2xl font-semibold">Want to work with us or have questions?</h3>
        <p className="text-muted-foreground">We’d love to hear from you.</p>
        <Button variant="default" size="lg">
          Contact Us
        </Button>
      </section>
    </div>
  );
}
