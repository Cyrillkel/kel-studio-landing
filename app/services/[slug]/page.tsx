import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ru from "@/locales/ru.json";
import JsonLd from "@/components/JsonLd";
import ServicePage from "@/components/services/ServicePage";
import { pageMetadata } from "@/lib/pageMetadata";
import {
  SERVICE_CONFIG,
  SERVICE_SLUGS,
  SERVICES_PATH,
  isServiceSlug,
  servicePath,
  type ServiceCopy,
} from "@/lib/services";
import { SITE_NAME, SITE_URL } from "@/lib/site";

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
  const url = `${SITE_URL}${servicePath(slug)}`;
  const { priceFrom } = SERVICE_CONFIG[slug];
  const common = ru.servicePages.common;

  // What search engines read besides the text: where the page sits, what the
  // service is (with a starting price where one is published), the questions.
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: common.breadcrumbHome, item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: common.breadcrumbServices, item: `${SITE_URL}${SERVICES_PATH}` },
          { "@type": "ListItem", position: 3, name: page.name, item: url },
        ],
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: page.title,
        serviceType: page.name,
        description: page.metaDescription,
        url,
        provider: { "@type": "ProfessionalService", name: SITE_NAME, url: SITE_URL },
        ...(priceFrom
          ? {
              offers: {
                "@type": "Offer",
                url,
                priceCurrency: "RUB",
                priceSpecification: { "@type": "PriceSpecification", priceCurrency: "RUB", minPrice: priceFrom },
              },
            }
          : {}),
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <ServicePage slug={slug} />
    </>
  );
}
