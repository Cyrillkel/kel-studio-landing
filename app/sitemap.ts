import type { MetadataRoute } from "next";
import { PRICES_PATH, SERVICE_SLUGS, SERVICES_PATH, servicePaths } from "@/lib/services";
import { BLOG_PATH, blogPath, getPosts, latestUpdate } from "@/lib/blog";
import { LANGS, withLang, type Lang, type PathPair } from "@/lib/lang";
import { hreflangPaths } from "@/lib/pageMetadata";
import { POLICY_UPDATED, PRIVACY_PATH, policyReady } from "@/lib/privacy";
import { PULSE_PATH } from "@/lib/pulse";
import { CONTENT_UPDATED, SITE_URL } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

// One page, with an entry for each language it exists in. A page that exists in
// both languages lists both versions in every one of its entries (hreflang), as
// search engines expect; `rest` can differ between the languages (the date of an
// article list, say).
function entries(paths: Partial<PathPair>, rest: (lang: Lang) => Omit<Entry, "url" | "alternates">): Entry[] {
  const hreflang = hreflangPaths(paths);
  const languages = hreflang
    ? Object.fromEntries(Object.entries(hreflang).map(([key, path]) => [key, `${SITE_URL}${path}`]))
    : null;
  return LANGS.flatMap((lang) =>
    paths[lang]
      ? [{ url: `${SITE_URL}${paths[lang]}`, ...rest(lang), ...(languages ? { alternates: { languages } } : {}) }]
      : []
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(CONTENT_UPDATED);
  const posts = { ru: getPosts("ru"), en: getPosts("en") };
  const slugs = [...new Set([...posts.ru, ...posts.en].map((post) => post.slug))];
  const page = (path: string): PathPair => ({ ru: path, en: withLang(path, "en") });

  return [
    ...entries(page("/"), () => ({ lastModified, changeFrequency: "monthly", priority: 1 })),
    ...entries(page(SERVICES_PATH), () => ({ lastModified, changeFrequency: "monthly", priority: 0.9 })),
    ...entries(page(PRICES_PATH), () => ({ lastModified, changeFrequency: "monthly", priority: 0.8 })),
    ...entries(page(PULSE_PATH), () => ({ lastModified, changeFrequency: "monthly", priority: 0.8 })),
    // The blog's list exists in a language once that language has an article.
    ...entries(
      Object.fromEntries(LANGS.filter((lang) => posts[lang].length).map((lang) => [lang, withLang(BLOG_PATH, lang)])),
      (lang) => ({ lastModified: new Date(latestUpdate(posts[lang])), changeFrequency: "weekly", priority: 0.7 })
    ),
    ...slugs.flatMap((slug) => {
      const byLang = (lang: Lang) => posts[lang].find((post) => post.slug === slug);
      return entries(
        Object.fromEntries(LANGS.filter((lang) => byLang(lang)).map((lang) => [lang, blogPath(slug, lang)])),
        (lang) => ({ lastModified: new Date(byLang(lang)!.updated), changeFrequency: "monthly", priority: 0.6 })
      );
    }),
    ...SERVICE_SLUGS.flatMap((slug) =>
      entries(servicePaths(slug), () => ({ lastModified, changeFrequency: "monthly", priority: 0.8 }))
    ),
    // Only the languages whose policy file has the text (see lib/privacy.ts).
    ...entries(
      Object.fromEntries(LANGS.filter((lang) => policyReady(lang)).map((lang) => [lang, withLang(PRIVACY_PATH, lang)])),
      () => ({ lastModified: new Date(POLICY_UPDATED), changeFrequency: "yearly", priority: 0.3 })
    ),
  ];
}
