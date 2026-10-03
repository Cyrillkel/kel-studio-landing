import type { Metadata } from "next";
import ru from "@/locales/ru.json";
import JsonLd from "@/components/JsonLd";
import ServicesHub from "@/components/services/ServicesHub";
import { pageMetadata } from "@/lib/pageMetadata";
import { breadcrumbNode, graph, serviceListNode, webPageNode } from "@/lib/schema";
import { SERVICES_PATH } from "@/lib/services";
import { SITE_URL } from "@/lib/site";

const hub = ru.servicePages.hub;

export const metadata: Metadata = pageMetadata({
  title: hub.metaTitle,
  description: hub.metaDescription,
  path: SERVICES_PATH,
});

export default function Page() {
  const common = ru.servicePages.common;
  const structuredData = graph(
    [
      webPageNode({
        path: SERVICES_PATH,
        name: hub.metaTitle,
        description: hub.metaDescription,
        type: "CollectionPage",
        breadcrumb: true,
        mainEntityId: `${SITE_URL}${SERVICES_PATH}#list`,
      }),
      breadcrumbNode(SERVICES_PATH, [
        { name: common.breadcrumbHome, path: "/" },
        { name: common.breadcrumbServices, path: SERVICES_PATH },
      ]),
      serviceListNode(SERVICES_PATH),
    ],
    { catalog: true }
  );

  return (
    <>
      <JsonLd data={structuredData} />
      <ServicesHub />
    </>
  );
}
