import FollowCursor from '@/components/cursor/follow-cursor';
import { ThemeProvider } from '@/components/provider/theme-provider';
import ToasterProvider from '@/components/provider/toaster-provider';
import OfflineProvider from '@/providers/offline-provider';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tariqul.dev'),
  title: 'Tariqul Islam — Web Developer & Designer',
  description: 'Portfolio of Tariqul Islam. Next.js, React, MongoDB, and modern web engineering.',
  keywords: ['Tariqul Islam', 'portfolio', 'web developer', 'Next.js', 'React', 'JavaScript'],
  authors: [{ name: 'Tariqul Islam', url: 'https://tariqul.dev' }],
  alternates: { canonical: 'https://tariqul.dev/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    title: 'Tariqul Islam - Tariqul Islam — Web Developer & Designer',
    description: 'Explore the portfolio of Tariqul Islam, a web developer with expertise in Next.js, React, and more.',
    url: 'https://tariqul.dev/',
    siteName: 'tariqul.dev',
    type: 'website',
    images: [{ url: '/og.png' }],
  },
  twitter: { card: 'summary_large_image', title: 'Tariqul Islam — Portfolio' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
    `,
          }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} antialiased  bg-white dark:bg-dark-deep`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <FollowCursor />
          <main className="min-h-screen">{children}</main>
          <OfflineProvider />
          <ToasterProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
