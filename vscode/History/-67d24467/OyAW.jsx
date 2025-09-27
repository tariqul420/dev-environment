import Footer from "@/components/globals/footer";
import Navbar from "@/components/globals/navbar";

export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto h-auto min-h-screen w-[90vw] max-w-7xl overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </>
  );
}
