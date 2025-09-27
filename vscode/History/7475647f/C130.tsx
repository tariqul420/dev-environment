import FollowCursor from '@/components/cursor/follow-cursor';
import { ThemeProvider } from '@/components/provider/theme-provider';
import ToasterProvider from '@/components/provider/toaster-provider';
import OfflineProvider from '@/providers/offline-provider';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal'],
});

export const metadata: Metadata = {
  title: 'Tariqul Islam - Portfolio',
  description: 'Portfolio of Tariqul Islam, showcasing web development projects, skills, and expertise in modern technologies.',
  keywords: ['Tariqul Islam', 'portfolio', 'web developer', 'Next.js', 'React', 'JavaScript', 'full-stack developer'],
  authors: [{ name: 'Tariqul Islam' }],
  openGraph: {
    title: 'Tariqul Islam - Portfolio',
    description: 'Explore the portfolio of Tariqul Islam, a skilled web developer with expertise in Next.js, React, and more.',
    url: 'https://tariqul.vercel.app',
    siteName: 'Tariqul Islam Portfolio',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} antialiased  bg-white dark:bg-dark-deep scroll-smooth `}>
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
