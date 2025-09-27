import Navbar from '../../components/navbar';

export default function RootLayout({ children }: ChildrenProps) {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-[90vw] max-w-7xl h-auto overflow-x-hidden min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
