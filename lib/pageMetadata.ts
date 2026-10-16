import type { Metadata } from "next";
import { INDEXABLE, SITE_NAME, SITE_TEXT, SITE_URL, VERIFICATION } from "./site";
import { withLang, type Lang, type PathPair } from "./lang";

export const OG_LOCALE: Record<Lang, string> = { ru: "ru_RU", en: "en_US" };

// The card shown when a link is posted in a messenger (app/(ru)/opengraph-image.tsx
// and app/(en)/en/opengraph-image.tsx).
export const ogImagePath = (lang: Lang) => withLang("/opengraph-image", lang);

// Who gets the page when their language is neither Russian nor English. Anyone who
// is not on the Russian version is more likely to read English than Russian.
const X_DEFAULT: Lang = "en";

// The hreflang links of a page that exists in both languages: each version points at
// both (itself too), and x-default names the fallback. Null for a page with one version
// only, which has nothing to link to.
export function hreflangPaths(paths: Partial<PathPair>): Record<string, string> | null {
  if (!paths.ru || !paths.en) return null;
  return { ru: paths.ru, en: paths.en, "x-default": paths[X_DEFAULT]! };
}

// The canonical address of a page and, when it exists in both languages, its hreflang links.
export function languageAlternates(paths: Partial<PathPair>, lang: Lang): NonNullable<Metadata["alternates"]> {
  const canonical = paths[lang]!;
  const languages = hreflangPaths(paths);
  return languages ? { canonical, languages } : { canonical };
}

// Metadata fields are merged shallowly: a page's openGraph replaces the whole
// one from the language's layout, so site name, language and the preview image
// have to be repeated, and twitter is set to match (it would otherwise keep the
// home page's text).
export function pageMetadata({
  lang,
  title,
  description,
  paths,
}: {
  lang: Lang;
  title: string;
  description: string;
  // The page's address in each language; one language only if the page has no translation.
  paths: Partial<PathPair>;
}): Metadata {
  const url = paths[lang]!;
  const image = ogImagePath(lang);
  return {
    title,
    description,
    alternates: languageAlternates(paths, lang),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALE[lang],
      title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

// What every page of a language inherits: set in the language's layout.
export function rootMetadata(lang: Lang): Metadata {
  const { title, description } = SITE_TEXT[lang];
  return {
    // Lets Next resolve the social image and canonical links to absolute URLs.
    metadataBase: new URL(SITE_URL),
    title,
    description,
    // Hidden from search until the content is final: see lib/site.ts.
    robots: { index: INDEXABLE, follow: INDEXABLE },
    verification: VERIFICATION,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: withLang("/", lang),
      locale: OG_LOCALE[lang],
      images: [{ url: ogImagePath(lang), width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImagePath(lang)] },
  };
}
