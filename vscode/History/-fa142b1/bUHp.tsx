import ClientClerkProvider from '@/components/providers/clerk-provider';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Meetora – Smart Video Interview Platform',
  description: 'Meetora is a modern video interview platform that helps teams streamline hiring with real-time calls, scheduling, and candidate evaluation — all in one place.',
  keywords: [
    'Meetora',
    'video interview platform',
    'remote hiring',
    'video calling app',
    'tech interview tool',
    'candidate screening',
    'react video app',
    'nextjs interview project',
    'online interview',
    'virtual hiring platform',
  ],
  authors: [{ name: 'Tariqul Islam', url: 'https://github.com/tariqul420' }],
  creator: 'Tariqul Islam',
  metadataBase: new URL('https://meetora.vercel.app'),
  openGraph: {
    title: 'Meetora – Smart Video Interview Platform',
    description: 'Host and manage video interviews with ease. Meetora offers high-quality calls, scheduling, and built-in evaluation tools for fast, effective hiring.',
    url: 'https://meetora.vercel.app',
    siteName: 'Meetora',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Meetora – Video Interview Platform',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meetora – Smart Video Interview Platform',
    description: 'Streamline your interviews with real-time video calls, candidate evaluation, and scheduling tools — all with Meetora.',
    images: ['/og-image.png'],
    creator: '@your_twitter_handle',
  },
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientClerkProvider>
          <main className="min-h-screen overflow-x-hidden">{children}</main>
        </ClientClerkProvider>
      </body>
    </html>
  );
}
