import Footer from '@/components/root/footer';
import Navbar from '@/components/root/navbar';
import { ChildrenProps } from '@/types';

export default function RootLayout({ children }: ChildrenProps) {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen w-[90vw] max-w-7xl py-12">{children}</main>
      <Footer />
    </>
  );
}
