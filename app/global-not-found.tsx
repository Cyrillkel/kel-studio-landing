import type { Metadata } from "next";
import GlobalNotFoundContent from "@/components/GlobalNotFoundContent";
import RootShell from "@/components/RootShell";
import { getDictionary } from "@/lib/dictionary";
import { fontClasses } from "@/lib/fonts.en";
import { NOT_FOUND_SCRIPT } from "@/lib/notFoundScript";

// The 404 page of the whole site (see experimental.globalNotFound in next.config.ts).
// Next adds noindex to every 404 on its own. The title replaces the English "404:
// This page could not be found." that used to sit next to the site's own; the
// server renders the Russian one, and an English address changes it after load.
// The fonts are the Latin-only ones on purpose: importing the Russian font module here
// put its Cyrillic preloads on every page of the site, English ones included (see
// next-font-manifest.json after a build). The Russian text of this page still gets
// Inter and Unbounded, because the stylesheet declares every subset and the browser
// fetches the Cyrillic one when it meets a Cyrillic letter.
export const metadata: Metadata = {
  title: getDictionary("ru").notFound.metaTitle,
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <RootShell lang="ru" fontClasses={fontClasses} headScript={NOT_FOUND_SCRIPT}>
      <GlobalNotFoundContent />
    </RootShell>
  );
}
