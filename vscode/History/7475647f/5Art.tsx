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
  title: 'Tariqul Islam — Full-Stack Web Developer & Designer',
  description:
    'Official portfolio of Tariqul Islam, a Full-Stack Web Developer & Designer from Bangladesh. Showcasing projects, case studies, and expertise in Next.js, React, TypeScript, MongoDB, PostgreSQL, Prisma, Tailwind CSS, and modern full-stack engineering.',
  keywords: [
    'Tariqul Islam',
    'Tariqul Islam portfolio',
    'Tariqul Islam web developer',
    'Full-stack developer Bangladesh',
    'Next.js developer portfolio',
    'React developer portfolio',
    'TypeScript developer portfolio',
    'JavaScript developer portfolio',
    'Frontend developer Bangladesh',
    'Backend developer Bangladesh',
    'MERN stack developer portfolio',
    'PostgreSQL developer portfolio',
    'MongoDB developer portfolio',
    'Prisma developer portfolio',
    'Web developer portfolio',
    'Freelance web developer',
    'Freelance full-stack developer',
    'Remote web developer',
    'Bangladesh software engineer',
    'UI/UX designer portfolio',
    'Tailwind CSS developer',
    'Open source projects portfolio',
    'Modern web applications',
    'Express.js developer portfolio',
  ],
  authors: [{ name: 'Tariqul Islam', url: 'https://tariqul.dev' }],
  creator: 'Tariqul Islam',
  publisher: 'Tariqul Islam',
  alternates: { canonical: 'https://tariqul.dev' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'Tariqul Islam — Full-Stack Web Developer & Designer',
    description:
      'Discover the portfolio of Tariqul Islam, a Full-Stack Developer & Designer from Bangladesh. Expert in Next.js, React, TypeScript, Prisma, MongoDB, and PostgreSQL. Explore modern projects and case studies.',
    url: 'https://tariqul.dev',
    siteName: 'tariqul.dev',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/assets/images/tariqul-islam.jpeg',
        width: 1200,
        height: 630,
        alt: 'Tariqul Islam — Full-Stack Web Developer & Designer',
      },
      {
        url: '/assets/logo/logo.png',
        width: 500,
        height: 500,
        alt: 'tariqul.dev logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tariqul Islam — Full-Stack Web Developer & Designer',
    description: 'Portfolio of Tariqul Islam, Full-Stack Web Developer & Designer. Specializing in Next.js, React, TypeScript, Prisma, MongoDB, PostgreSQL, and modern full-stack development.',
    images: ['/assets/images/tariqul-islam.jpeg'],
    creator: '@tariqul420',
  },
  category: 'Portfolio',
  applicationName: 'tariqul.dev',
  generator: 'Next.js 15',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
      <body className={`${spaceGrotesk.variable} antialiased`} suppressHydrationWarning>
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
