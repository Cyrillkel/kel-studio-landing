import type { Metadata } from "next";
import ru from "@/locales/ru.json";
import JsonLd from "@/components/JsonLd";
import PricesPage from "@/components/services/PricesPage";
import { pageMetadata } from "@/lib/pageMetadata";
import { PRICES_PATH } from "@/lib/services";
import { SITE_URL } from "@/lib/site";

const prices = ru.servicePages.pricesPage;

export const metadata: Metadata = pageMetadata({
  title: prices.metaTitle,
  description: prices.metaDescription,
  path: PRICES_PATH,
});

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ru.servicePages.common.breadcrumbHome, item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: prices.crumb, item: `${SITE_URL}${PRICES_PATH}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: prices.faq.map((item) => ({
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
      <PricesPage />
    </>
  );
}
