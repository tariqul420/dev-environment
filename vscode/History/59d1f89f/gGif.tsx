'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-24 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight">Let’s Talk</h1>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto">We'd love to hear from you. Whether you’re a recruiter, candidate, or just curious about Meetora — reach out!</p>
      </div>

      {/* Contact Card */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-muted/50 backdrop-blur rounded-2xl overflow-hidden shadow-lg">
        {/* Contact Info Section */}
        <div className="p-10 bg-gradient-to-br from-primary/90 to-primary text-white space-y-6">
          <h2 className="text-2xl font-semibold">Contact Information</h2>
          <p className="text-sm text-white/90">Our team typically replies within 1–2 business days.</p>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 mt-1" />
              <span>support@meetora.app</span>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 mt-1" />
              <span>+880 123-456-7890</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-1" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form className="p-10 space-y-6 bg-background">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <Input id="name" placeholder="Jane Doe" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              Subject
            </label>
            <Input id="subject" placeholder="Interview issue, feedback, etc." />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Your Message
            </label>
            <Textarea id="message" placeholder="Write your message here..." rows={6} required />
          </div>

          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
}
