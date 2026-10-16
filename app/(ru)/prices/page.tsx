import type { Metadata } from "next";
import ru from "@/locales/ru.json";
import JsonLd from "@/components/JsonLd";
import PricesPage from "@/components/services/PricesPage";
import { pageMetadata } from "@/lib/pageMetadata";
import { breadcrumbNode, faqNode, graph, priceListNode, webPageNode } from "@/lib/schema";
import { PRICES_PATH, PRICE_TABLE_SLUGS } from "@/lib/services";
import { SITE_URL } from "@/lib/site";

const prices = ru.servicePages.pricesPage;

export const metadata: Metadata = pageMetadata({
  title: prices.metaTitle,
  description: prices.metaDescription,
  path: PRICES_PATH,
});

export default function Page() {
  const structuredData = graph([
    webPageNode({
      path: PRICES_PATH,
      name: prices.metaTitle,
      description: prices.metaDescription,
      breadcrumb: true,
      mainEntityId: `${SITE_URL}${PRICES_PATH}#prices`,
    }),
    breadcrumbNode(PRICES_PATH, [
      { name: ru.servicePages.common.breadcrumbHome, path: "/" },
      { name: prices.crumb, path: PRICES_PATH },
    ]),
    priceListNode(PRICES_PATH, PRICE_TABLE_SLUGS),
    faqNode(PRICES_PATH, prices.faq),
  ]);

  return (
    <>
      <JsonLd data={structuredData} />
      <PricesPage />
    </>
  );
}
