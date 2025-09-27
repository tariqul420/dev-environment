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

export const metadata = {
  title: 'TJishanul Haque',
  description: 'Portfolio of Jishanul Haque, showcasing web development projects, skills, and expertise in modern technologies.',
  keywords: ['Jishanul Haque', 'portfolio', 'web developer', 'Next.js', 'React', 'JavaScript', 'full-stack developer'],
  authors: [{ name: 'Jishanul Haque' }],
  openGraph: {
    title: 'Jishanul Haque',
    description: 'Explore the portfolio of Jishanul Haque, a skilled web developer with expertise in Next.js, React, and more.',
    url: 'https://jishanul.vercel.app',
    siteName: 'Jishanul Haque',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
