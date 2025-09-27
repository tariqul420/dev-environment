'use client';

import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background border-t mt-16">
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-sm text-muted-foreground">
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="text-2xl font-extrabold text-foreground">
            Meetora
          </Link>
          <p>Empowering teams with smarter, bias-free interviews.</p>
        </div>

        {/* Product */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Product</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/features" className="hover:underline">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:underline">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Company</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:underline">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Follow Us</h4>
          <div className="flex space-x-4 text-muted-foreground">
            <a href="https://twitter.com" target="_blank" aria-label="Twitter" className="hover:text-primary transition">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="https://github.com" target="_blank" aria-label="GitHub" className="hover:text-primary transition">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn" className="hover:text-primary transition">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t pt-8 pb-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Meetora. All rights reserved.</div>
    </footer>
  );
}
