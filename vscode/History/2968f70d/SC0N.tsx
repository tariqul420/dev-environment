import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import LanguageHydrationProvider from "@/components/providers/language-hydration-provider";
import HelpWidget from "@/components/root/help-widget";
import { ChildrenProps } from "@/types";

export default function RootLayout({ children }: ChildrenProps) {
  return (
    <>
      <Navbar />
      <LanguageHydrationProvider>
        <main className="mx-auto min-h-screen w-[90vw] max-w-7xl py-14">
          {children}
          <HelpWidget />
        </main>
      </LanguageHydrationProvider>
      <Footer />
    </>
  );
}
