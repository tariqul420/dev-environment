import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import HelpWidget from "@/components/root/help-widget";
import { useLanguageHydration } from "@/hooks/use-language-hydration";
import { ChildrenProps } from "@/types";

export default function RootLayout({ children }: ChildrenProps) {
  useLanguageHydration();

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen w-[90vw] max-w-7xl py-14">
        {children}
        <HelpWidget />
        useLanguageHydration();
      </main>
      <Footer />
    </>
  );
}
