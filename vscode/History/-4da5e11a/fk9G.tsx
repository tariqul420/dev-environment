'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background border-t mt-10">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm text-muted-foreground">
        {/* Column 1 - Brand */}
        <div className="space-y-3">
          <Link href="/" className="text-lg font-semibold text-foreground">
            Meetora
          </Link>
          <p className="text-muted-foreground">Smarter interviews. Better hiring.</p>
        </div>

        {/* Column 2 - Product */}
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Product</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/pricing" className="hover:underline">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/features" className="hover:underline">
                Features
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 - Company */}
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Company</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/about" className="hover:underline">
                About Us
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

        {/* Column 4 - Legal */}
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Legal</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline">
                Terms of Use
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t py-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Meetora. All rights reserved.</div>
    </footer>
  );
}
