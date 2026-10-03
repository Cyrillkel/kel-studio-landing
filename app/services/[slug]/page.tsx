import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ru from "@/locales/ru.json";
import JsonLd from "@/components/JsonLd";
import ServicePage from "@/components/services/ServicePage";
import { pageMetadata } from "@/lib/pageMetadata";
import { breadcrumbNode, faqNode, graph, serviceNode, webPageNode } from "@/lib/schema";
import {
  SERVICE_SLUGS,
  SERVICES_PATH,
  isServiceSlug,
  servicePath,
  type ServiceCopy,
} from "@/lib/services";

// Only the known services exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isServiceSlug(slug)) return {};
  // Metadata is rendered on the server, where the site speaks Russian; the
  // language switcher only changes what the visitor sees.
  const page: ServiceCopy = ru.servicePages.items[slug];
  return pageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: servicePath(slug),
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isServiceSlug(slug)) notFound();

  const page: ServiceCopy = ru.servicePages.items[slug];
  const path = servicePath(slug);
  const common = ru.servicePages.common;

  // What search engines read besides the text: where the page sits, what the
  // service is (with a starting price where one is published), the questions.
  const structuredData = graph([
    webPageNode({
      path,
      name: page.metaTitle,
      description: page.metaDescription,
      breadcrumb: true,
      aboutId: serviceNode(slug)["@id"] as string,
    }),
    breadcrumbNode(path, [
      { name: common.breadcrumbHome, path: "/" },
      { name: common.breadcrumbServices, path: SERVICES_PATH },
      { name: page.name, path },
    ]),
    serviceNode(slug),
    faqNode(path, page.faq),
  ]);

  return (
    <>
      <JsonLd data={structuredData} />
      <ServicePage slug={slug} />
    </>
  );
}
