import ru from "@/locales/ru.json";
import {
  CONTACT_EMAIL,
  CONTENT_UPDATED,
  PHONE_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  TELEGRAM_CHANNEL_URL,
  TELEGRAM_URL,
} from "./site";
import { SERVICE_CONFIG, SERVICE_SLUGS, plainText, servicePath, type ServiceSlug } from "./services";

// Structured data (schema.org JSON-LD). Every page sends ONE graph with the
// organization and the site plus its own nodes, tied together by @id, so a
// crawler never has to match separate blocks. All text comes from the Russian
// copy (the server always renders Russian) and describes what the page shows.

export const ORG_ID = `${SITE_URL}/#organization`;
export const SITE_ID = `${SITE_URL}/#website`;

const telephone = PHONE_URL.replace("tel:", "");
const russia = { "@type": "Country", name: "Россия" };

type Node = Record<string, unknown>;

// The company. An Organization rather than a LocalBusiness: the studio works
// across Russia and has no public address. With `catalog` it also lists the
// services (used on the home page and the services page).
export function organizationNode({ catalog = false } = {}): Node {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    alternateName: "kel.agency",
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/apple-icon.png`, width: 180, height: 180 },
    image: `${SITE_URL}/opengraph-image`,
    description: SITE_DESCRIPTION,
    email: CONTACT_EMAIL,
    telephone,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone,
        email: CONTACT_EMAIL,
        availableLanguage: "ru",
        areaServed: "RU",
      },
    ],
    sameAs: [TELEGRAM_CHANNEL_URL, TELEGRAM_URL],
    areaServed: russia,
    knowsLanguage: "ru",
    ...(catalog
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: ru.servicePages.hub.title,
            itemListElement: SERVICE_SLUGS.map((slug) => ({
              "@type": "Offer",
              itemOffered: serviceRef(slug),
            })),
          },
        }
      : {}),
  };
}

export function websiteNode(): Node {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    alternateName: "kel.agency",
    inLanguage: "ru",
    publisher: { "@id": ORG_ID },
  };
}

const pageUrl = (path: string) => (path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`);

// The page itself. `type` is WebPage, CollectionPage, and so on.
export function webPageNode({
  path,
  name,
  description,
  modified = CONTENT_UPDATED,
  type = "WebPage",
  breadcrumb = false,
  aboutId = ORG_ID,
  mainEntityId,
}: {
  path: string;
  name: string;
  description: string;
  modified?: string;
  type?: string;
  breadcrumb?: boolean;
  // What the page is about (the company by default) and its main entity.
  aboutId?: string;
  mainEntityId?: string;
}): Node {
  const url = pageUrl(path);
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: "ru",
    isPartOf: { "@id": SITE_ID },
    about: { "@id": aboutId },
    dateModified: modified,
    ...(mainEntityId ? { mainEntity: { "@id": mainEntityId } } : {}),
    ...(breadcrumb ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
  };
}

export function breadcrumbNode(path: string, trail: { name: string; path: string }[]): Node {
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl(path)}#breadcrumb`,
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: pageUrl(item.path),
    })),
  };
}

export function faqNode(path: string, faq: { q: string; a: string }[]): Node {
  const url = pageUrl(path);
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    isPartOf: { "@id": `${url}#webpage` },
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: plainText(item.a) },
    })),
  };
}

// A short reference to a service, for lists on other pages.
function serviceRef(slug: ServiceSlug): Node {
  return {
    "@type": "Service",
    "@id": `${pageUrl(servicePath(slug))}#service`,
    name: ru.servicePages.items[slug].name,
    url: pageUrl(servicePath(slug)),
  };
}

// "From N rubles", as the page states it; hourly rates carry their unit.
export function priceSpecification(slug: ServiceSlug): Node | null {
  const { priceFrom, priceUnit } = SERVICE_CONFIG[slug];
  if (!priceFrom) return null;
  return priceUnit
    ? { "@type": "UnitPriceSpecification", priceCurrency: "RUB", minPrice: priceFrom, unitCode: priceUnit }
    : { "@type": "PriceSpecification", priceCurrency: "RUB", minPrice: priceFrom };
}

export function serviceNode(slug: ServiceSlug): Node {
  const copy = ru.servicePages.items[slug];
  const url = pageUrl(servicePath(slug));
  const price = priceSpecification(slug);
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: copy.title,
    serviceType: copy.name,
    description: copy.metaDescription,
    url,
    image: `${SITE_URL}/opengraph-image`,
    provider: { "@id": ORG_ID },
    areaServed: russia,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    ...(price ? { offers: { "@type": "Offer", url, priceCurrency: "RUB", priceSpecification: price } } : {}),
  };
}

// The list of services on /services.
export function serviceListNode(path: string): Node {
  return {
    "@type": "ItemList",
    "@id": `${pageUrl(path)}#list`,
    itemListElement: SERVICE_SLUGS.map((slug, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: ru.servicePages.items[slug].name,
      url: pageUrl(servicePath(slug)),
    })),
  };
}

// The price list on /prices: the same figures the table shows.
export function priceListNode(path: string, slugs: readonly ServiceSlug[]): Node {
  return {
    "@type": "OfferCatalog",
    "@id": `${pageUrl(path)}#prices`,
    name: ru.servicePages.pricesPage.tableTitle,
    itemListElement: slugs.flatMap((slug) => {
      const price = priceSpecification(slug);
      return price
        ? [{ "@type": "Offer", itemOffered: serviceRef(slug), priceCurrency: "RUB", priceSpecification: price }]
        : [];
    }),
  };
}

// One JSON-LD document for a page: the common nodes first, then the page's own.
export function graph(nodes: Node[], { catalog = false } = {}) {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode({ catalog }), websiteNode(), ...nodes],
  };
}
