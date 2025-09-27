import ClientClerkProvider from '@/components/providers/clerk-provider';
import StreamClientProvider from '@/components/providers/stream-client-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
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
        url: './assets/icon.webp',
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
    images: ['./assets/icon.webp'],
    creator: '@your_twitter_handle',
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressContentEditableWarning className={`${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ClientClerkProvider>
            <StreamClientProvider>
              <main className="min-h-screen overflow-x-hidden">{children}</main>
            </StreamClientProvider>
          </ClientClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
