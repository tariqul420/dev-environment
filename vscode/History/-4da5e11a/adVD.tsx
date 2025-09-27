'use client';

import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background border-t mt-10">
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm">
        {/* Brand */}
        <div className="space-y-3">
          <Link href="/" className="text-xl font-bold text-foreground">
            Meetora
          </Link>
          <p className="text-muted-foreground">The smart way to run interviews.</p>
        </div>

        {/* Product */}
        <div>
          <h4 className="font-semibold text-foreground mb-2">Product</h4>
          <ul className="space-y-1 text-muted-foreground">
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
              <Link href="/help" className="hover:underline">
                Help Center
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold text-foreground mb-2">Company</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:underline">
                Careers
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold text-foreground mb-2">Follow Us</h4>
          <div className="flex gap-4 text-muted-foreground">
            <a href="https://twitter.com" target="_blank" aria-label="Twitter">
              <Twitter className="w-5 h-5 hover:text-foreground" />
            </a>
            <a href="https://github.com" target="_blank" aria-label="GitHub">
              <Github className="w-5 h-5 hover:text-foreground" />
            </a>
            <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5 hover:text-foreground" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t pt-6 pb-10 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Meetora. All rights reserved.</div>
    </footer>
  );
}
