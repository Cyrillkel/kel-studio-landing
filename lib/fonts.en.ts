import { Inter, Unbounded } from "next/font/google";

// The same fonts as the Russian pages, without the Cyrillic subset: an English
// page has no use for it, and the browser would be told to preload it. The one
// Russian word on the page (the name of the language in the switcher) falls
// back to a system font.
const inter = Inter({ subsets: ["latin"] });
const unbounded = Unbounded({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-unbounded",
});

export const fontClasses = `${inter.className} ${unbounded.variable}`;
