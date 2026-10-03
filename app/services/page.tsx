import type { Metadata } from "next";
import ru from "@/locales/ru.json";
import JsonLd from "@/components/JsonLd";
import ServicesHub from "@/components/services/ServicesHub";
import { pageMetadata } from "@/lib/pageMetadata";
import { SERVICE_SLUGS, SERVICES_PATH, servicePath, type ServiceCopy } from "@/lib/services";
import { SITE_URL } from "@/lib/site";

const hub = ru.servicePages.hub;

export const metadata: Metadata = pageMetadata({
  title: hub.metaTitle,
  description: hub.metaDescription,
  path: SERVICES_PATH,
});

export default function Page() {
  const common = ru.servicePages.common;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: common.breadcrumbHome, item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: common.breadcrumbServices, item: `${SITE_URL}${SERVICES_PATH}` },
        ],
      },
      {
        "@type": "CollectionPage",
        name: hub.title,
        url: `${SITE_URL}${SERVICES_PATH}`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: SERVICE_SLUGS.map((slug, index) => {
            const copy: ServiceCopy = ru.servicePages.items[slug];
            return {
              "@type": "ListItem",
              position: index + 1,
              name: copy.name,
              url: `${SITE_URL}${servicePath(slug)}`,
            };
          }),
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <ServicesHub />
    </>
  );
}
