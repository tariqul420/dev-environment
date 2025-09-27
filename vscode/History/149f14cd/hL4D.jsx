import { Geist, Geist_Mono } from 'next/font/google';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
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
  title: 'Tariqul Islam',
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar></Navbar>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
