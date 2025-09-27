// fonts.ts
import {
  DM_Serif_Display,
  Hind_Siliguri,
  Inter,
  Space_Grotesk,
} from "next/font/google";

// English Modern Font (Sans)
export const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

// Bengali Font
export const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
});

// Elegant Serif Font
export const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
});

// Clean Sans Font (alternative to Grotesk)
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
