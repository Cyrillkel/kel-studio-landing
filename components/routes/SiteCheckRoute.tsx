import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import SiteCheckPage from "@/components/sitecheck/SiteCheckPage";
import { getDictionary } from "@/lib/dictionary";
import { withLang, type Lang, type PathPair } from "@/lib/lang";
import { pageMetadata } from "@/lib/pageMetadata";
import { breadcrumbNode, faqNode, graph, webPageNode } from "@/lib/schema";
import { SITE_CHECK_PATH } from "@/lib/sitecheck";

// The free website check (/site-check, /en/site-check).
export const siteCheckPaths: PathPair = { ru: SITE_CHECK_PATH, en: withLang(SITE_CHECK_PATH, "en") };

export function siteCheckMetadata(lang: Lang): Metadata {
  const page = getDictionary(lang).siteCheck;
  return pageMetadata({ lang, title: page.metaTitle, description: page.metaDescription, paths: siteCheckPaths });
}

export default function SiteCheckRoute({ lang }: { lang: Lang }) {
  const dict = getDictionary(lang);
  const page = dict.siteCheck;
  const path = siteCheckPaths[lang];
  const structuredData = graph(
    [
      webPageNode({ path, name: page.metaTitle, description: page.metaDescription, lang, breadcrumb: true }),
      breadcrumbNode(path, [
        { name: dict.servicePages.common.breadcrumbHome, path: withLang("/", lang) },
        { name: page.crumb, path },
      ]),
      faqNode(path, page.faq),
    ],
    { lang }
  );

  return (
    <>
      <JsonLd data={structuredData} />
      <SiteCheckPage />
    </>
  );
}
