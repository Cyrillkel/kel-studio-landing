import { getDictionary } from "./dictionary";
import {
  CONTACT_EMAIL,
  CONTENT_UPDATED,
  PHONE_URL,
  SITE_NAME,
  SITE_TEXT,
  SITE_URL,
  TELEGRAM_CHANNEL_URL,
  TELEGRAM_URL,
} from "./site";
import { blogPath, type Post } from "./blog";
import { LANGS, withLang, type Lang } from "./lang";
import { ogImagePath } from "./pageMetadata";
import {
  SERVICE_CONFIG,
  SERVICE_SLUGS,
  plainText,
  servicePath,
  toUsd,
  type ServiceSlug,
} from "./services";

// Structured data (schema.org JSON-LD). Every page sends ONE graph with the
// organization and the site plus its own nodes, tied together by @id, so a
// crawler never has to match separate blocks. All text comes from the copy of
// the page's own language and describes what the page shows.

// The company is one entity for both languages; each language has a website of its own.
export const ORG_ID = `${SITE_URL}/#organization`;
export const siteId = (lang: Lang) => `${SITE_URL}${lang === "en" ? withLang("/", lang) : "/"}#website`;

const telephone = PHONE_URL.replace("tel:", "");
const russia = { "@type": "Country", name: "Россия" };

type Node = Record<string, unknown>;

// The company. An Organization rather than a LocalBusiness: the studio has no
// public address. With `catalog` it also lists the services (used on the home
// page and the services page). The Russian pages say the studio serves Russia;
// the English ones say nothing about the area, since where foreign clients can
// be served is a business decision (add `areaServed` here when it is made).
export function organizationNode({ catalog = false, lang = "ru" as Lang } = {}): Node {
  const dict = getDictionary(lang);
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    alternateName: "kel.agency",
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/apple-icon.png`, width: 180, height: 180 },
    image: `${SITE_URL}${ogImagePath(lang)}`,
    description: SITE_TEXT[lang].description,
    email: CONTACT_EMAIL,
    telephone,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone,
        email: CONTACT_EMAIL,
        availableLanguage: [...LANGS],
        ...(lang === "ru" ? { areaServed: "RU" } : {}),
      },
    ],
    sameAs: [TELEGRAM_CHANNEL_URL, TELEGRAM_URL],
    ...(lang === "ru" ? { areaServed: russia } : {}),
    knowsLanguage: [...LANGS],
    ...(catalog
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: dict.servicePages.hub.title,
            itemListElement: SERVICE_SLUGS.map((slug) => ({
              "@type": "Offer",
              itemOffered: serviceRef(slug, lang),
            })),
          },
        }
      : {}),
  };
}

export function websiteNode(lang: Lang = "ru"): Node {
  return {
    "@type": "WebSite",
    "@id": siteId(lang),
    url: `${SITE_URL}${lang === "en" ? withLang("/", lang) : "/"}`,
    name: SITE_NAME,
    alternateName: "kel.agency",
    inLanguage: lang,
    publisher: { "@id": ORG_ID },
  };
}

const pageUrl = (path: string) => (path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`);

// The page itself. `type` is WebPage, CollectionPage, and so on.
export function webPageNode({
  path,
  name,
  description,
  lang = "ru",
  modified = CONTENT_UPDATED,
  type = "WebPage",
  breadcrumb = false,
  aboutId = ORG_ID,
  mainEntityId,
}: {
  path: string;
  name: string;
  description: string;
  lang?: Lang;
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
    inLanguage: lang,
    isPartOf: { "@id": siteId(lang) },
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
function serviceRef(slug: ServiceSlug, lang: Lang): Node {
  return {
    "@type": "Service",
    "@id": `${pageUrl(servicePath(slug, lang))}#service`,
    name: getDictionary(lang).servicePages.items[slug].name,
    url: pageUrl(servicePath(slug, lang)),
  };
}

// "From N", as the page states it: rubles on the Russian pages, dollars (at the
// rate in lib/services.ts) on the English ones. Hourly rates carry their unit.
export function priceSpecification(slug: ServiceSlug, lang: Lang = "ru"): Node | null {
  const { priceFrom, priceUnit } = SERVICE_CONFIG[slug];
  if (!priceFrom) return null;
  const priceCurrency = lang === "en" ? "USD" : "RUB";
  const minPrice = lang === "en" ? toUsd(priceFrom) : priceFrom;
  return priceUnit
    ? { "@type": "UnitPriceSpecification", priceCurrency, minPrice, unitCode: priceUnit }
    : { "@type": "PriceSpecification", priceCurrency, minPrice };
}

export function serviceNode(slug: ServiceSlug, lang: Lang = "ru"): Node {
  const copy = getDictionary(lang).servicePages.items[slug];
  const url = pageUrl(servicePath(slug, lang));
  const price = priceSpecification(slug, lang);
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: copy.title,
    serviceType: copy.name,
    description: copy.metaDescription,
    url,
    image: `${SITE_URL}${ogImagePath(lang)}`,
    provider: { "@id": ORG_ID },
    ...(lang === "ru" ? { areaServed: russia } : {}),
    mainEntityOfPage: { "@id": `${url}#webpage` },
    ...(price
      ? { offers: { "@type": "Offer", url, priceCurrency: lang === "en" ? "USD" : "RUB", priceSpecification: price } }
      : {}),
  };
}

// The list of services on /services.
export function serviceListNode(path: string, lang: Lang = "ru"): Node {
  const dict = getDictionary(lang);
  return {
    "@type": "ItemList",
    "@id": `${pageUrl(path)}#list`,
    itemListElement: SERVICE_SLUGS.map((slug, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: dict.servicePages.items[slug].name,
      url: pageUrl(servicePath(slug, lang)),
    })),
  };
}

// The price list on /prices: the same figures the table shows.
export function priceListNode(path: string, slugs: readonly ServiceSlug[], lang: Lang = "ru"): Node {
  return {
    "@type": "OfferCatalog",
    "@id": `${pageUrl(path)}#prices`,
    name: getDictionary(lang).servicePages.pricesPage.tableTitle,
    itemListElement: slugs.flatMap((slug) => {
      const price = priceSpecification(slug, lang);
      return price
        ? [
            {
              "@type": "Offer",
              itemOffered: serviceRef(slug, lang),
              priceCurrency: lang === "en" ? "USD" : "RUB",
              priceSpecification: price,
            },
          ]
        : [];
    }),
  };
}

// A blog article. The byline reads "Админ" ("Admin"), which says nothing to a
// search engine, so the studio is both author and publisher in the markup.
export function articleNode(post: Post): Node {
  const url = pageUrl(blogPath(post.slug, post.lang));
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    inLanguage: post.lang,
    datePublished: post.date,
    dateModified: post.updated,
    image: `${SITE_URL}${blogPath(post.slug, post.lang)}/opengraph-image`,
    articleSection: post.category,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

// One JSON-LD document for a page: the common nodes first, then the page's own.
export function graph(nodes: Node[], { catalog = false, lang = "ru" as Lang } = {}) {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode({ catalog, lang }), websiteNode(lang), ...nodes],
  };
}
