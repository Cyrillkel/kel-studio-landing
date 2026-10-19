import LaunchCurtain from "@/components/LaunchCurtain";
import YandexMetrika from "@/components/YandexMetrika";
import "@/app/globals.css";
import { THEME_SCRIPT } from "@/lib/theme";
import type { Lang } from "@/lib/lang";
import { YANDEX_METRIKA_ID } from "@/lib/site";

// The <html> and <body> of a page, shared by the Russian and the English root
// layouts (app/(ru)/layout.tsx, app/(en)/layout.tsx). Each language has its own
// root layout because <html lang> is part of the page the server sends, and a
// language that changed in the browser afterwards would leave search engines
// reading the wrong one.
//
// <html data-theme> is rendered as "dark" and corrected by the script in <head>
// before the first paint when the visitor has chosen the light theme (lib/theme.ts).
// React would see that as a mismatch, hence suppressHydrationWarning on this one
// element (it covers only the element's own attributes, not its children). This
// is the pattern from the Next.js guide "Preventing flash before hydration".
//
// data-scroll-behavior="smooth": the page scrolls smoothly (scroll-smooth), but
// a move to another page must land at its top at once. Since Next.js 16 the
// router only switches smooth scrolling off for that when this attribute is
// there; without it the jump to the top was animated, the new page's
// ScrollSmoother cut it short, and a page opened from far down the home page
// stayed at its bottom.
export default function RootShell({
  lang,
  fontClasses,
  headScript,
  children,
}: {
  lang: Lang;
  fontClasses: string;
  // A script for <head> that runs before the first paint, besides the theme one.
  headScript?: string;
  children: React.ReactNode;
}) {
  return (
    <html lang={lang} data-theme="dark" data-scroll-behavior="smooth" className="scroll-smooth" suppressHydrationWarning>
      {/* The rule below is meant for the Pages Router and only exempts files under app/. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {headScript && <script dangerouslySetInnerHTML={{ __html: headScript }} />}
      </head>
      <body className={fontClasses}>
        {children}
        <LaunchCurtain />
        <YandexMetrika />
        {/* Counts visitors who have JavaScript turned off. */}
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
