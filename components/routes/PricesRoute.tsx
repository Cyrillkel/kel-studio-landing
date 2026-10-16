import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PricesPage from "@/components/services/PricesPage";
import { getDictionary } from "@/lib/dictionary";
import { withLang, type Lang, type PathPair } from "@/lib/lang";
import { pageMetadata } from "@/lib/pageMetadata";
import { breadcrumbNode, faqNode, graph, priceListNode, webPageNode } from "@/lib/schema";
import { PRICES_PATH, PRICE_TABLE_SLUGS } from "@/lib/services";
import { SITE_URL } from "@/lib/site";

// The price page (/prices, /en/prices).
export const pricesPaths: PathPair = { ru: PRICES_PATH, en: withLang(PRICES_PATH, "en") };

export function pricesMetadata(lang: Lang): Metadata {
  const prices = getDictionary(lang).servicePages.pricesPage;
  return pageMetadata({ lang, title: prices.metaTitle, description: prices.metaDescription, paths: pricesPaths });
}

export default function PricesRoute({ lang }: { lang: Lang }) {
  const dict = getDictionary(lang).servicePages;
  const prices = dict.pricesPage;
  const path = pricesPaths[lang];
  const structuredData = graph(
    [
      webPageNode({
        path,
        name: prices.metaTitle,
        description: prices.metaDescription,
        lang,
        breadcrumb: true,
        mainEntityId: `${SITE_URL}${path}#prices`,
      }),
      breadcrumbNode(path, [
        { name: dict.common.breadcrumbHome, path: withLang("/", lang) },
        { name: prices.crumb, path },
      ]),
      priceListNode(path, PRICE_TABLE_SLUGS, lang),
      faqNode(path, prices.faq),
    ],
    { lang }
  );

  return (
    <>
      <JsonLd data={structuredData} />
      <PricesPage />
    </>
  );
}
