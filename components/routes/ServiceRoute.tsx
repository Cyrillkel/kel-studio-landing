import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ServicePage from "@/components/services/ServicePage";
import { getDictionary } from "@/lib/dictionary";
import { withLang, type Lang } from "@/lib/lang";
import { pageMetadata } from "@/lib/pageMetadata";
import { breadcrumbNode, faqNode, graph, serviceNode, webPageNode } from "@/lib/schema";
import {
  SERVICE_SLUGS,
  SERVICES_PATH,
  serviceFromUrlSlug,
  servicePath,
  servicePaths,
  serviceUrlSlug,
  type ServiceCopy,
} from "@/lib/services";

// A service page. `urlSlug` is the part of the address that names the service:
// it can differ between the languages (lib/services.ts).
export const serviceStaticParams = (lang: Lang) =>
  SERVICE_SLUGS.map((slug) => ({ slug: serviceUrlSlug(slug, lang) }));

export function serviceMetadata(lang: Lang, urlSlug: string): Metadata {
  const slug = serviceFromUrlSlug(urlSlug, lang);
  if (!slug) return {};
  const page: ServiceCopy = getDictionary(lang).servicePages.items[slug];
  return pageMetadata({
    lang,
    title: page.metaTitle,
    description: page.metaDescription,
    paths: servicePaths(slug),
  });
}

export default function ServiceRoute({ lang, urlSlug }: { lang: Lang; urlSlug: string }) {
  const slug = serviceFromUrlSlug(urlSlug, lang);
  if (!slug) notFound();

  const dict = getDictionary(lang).servicePages;
  const page: ServiceCopy = dict.items[slug];
  const path = servicePath(slug, lang);

  // What search engines read besides the text: where the page sits, what the
  // service is (with a starting price where one is published), the questions.
  const structuredData = graph(
    [
      webPageNode({
        path,
        name: page.metaTitle,
        description: page.metaDescription,
        lang,
        breadcrumb: true,
        aboutId: serviceNode(slug, lang)["@id"] as string,
      }),
      breadcrumbNode(path, [
        { name: dict.common.breadcrumbHome, path: withLang("/", lang) },
        { name: dict.common.breadcrumbServices, path: withLang(SERVICES_PATH, lang) },
        { name: page.name, path },
      ]),
      serviceNode(slug, lang),
      faqNode(path, page.faq),
    ],
    { lang }
  );

  return (
    <>
      <JsonLd data={structuredData} />
      <ServicePage slug={slug} />
    </>
  );
}
