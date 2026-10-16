import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import ServicesHub from "@/components/services/ServicesHub";
import { getDictionary } from "@/lib/dictionary";
import { withLang, type Lang, type PathPair } from "@/lib/lang";
import { pageMetadata } from "@/lib/pageMetadata";
import { breadcrumbNode, graph, serviceListNode, webPageNode } from "@/lib/schema";
import { SERVICES_PATH } from "@/lib/services";
import { SITE_URL } from "@/lib/site";

// The page that lists every service (/services, /en/services).
export const servicesPaths: PathPair = { ru: SERVICES_PATH, en: withLang(SERVICES_PATH, "en") };

export function servicesMetadata(lang: Lang): Metadata {
  const hub = getDictionary(lang).servicePages.hub;
  return pageMetadata({ lang, title: hub.metaTitle, description: hub.metaDescription, paths: servicesPaths });
}

export default function ServicesRoute({ lang }: { lang: Lang }) {
  const dict = getDictionary(lang).servicePages;
  const hub = dict.hub;
  const path = servicesPaths[lang];
  const structuredData = graph(
    [
      webPageNode({
        path,
        name: hub.metaTitle,
        description: hub.metaDescription,
        lang,
        type: "CollectionPage",
        breadcrumb: true,
        mainEntityId: `${SITE_URL}${path}#list`,
      }),
      breadcrumbNode(path, [
        { name: dict.common.breadcrumbHome, path: withLang("/", lang) },
        { name: dict.common.breadcrumbServices, path },
      ]),
      serviceListNode(path, lang),
    ],
    { catalog: true, lang }
  );

  return (
    <>
      <JsonLd data={structuredData} />
      <ServicesHub />
    </>
  );
}
