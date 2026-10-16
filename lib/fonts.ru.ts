import { Inter, Unbounded } from "next/font/google";

const inter = Inter({ subsets: ["latin", "cyrillic"] });
// Headings are all bold, so one static weight: the full variable font is about
// 80 kB for these two subsets, the single 700 weight about 33 kB.
const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: "700",
  variable: "--font-unbounded",
});

// The classes for <body> of the Russian pages.
export const fontClasses = `${inter.className} ${unbounded.variable}`;
