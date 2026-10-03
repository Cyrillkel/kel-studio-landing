// One entry per service page. Order matters: it drives the services hub, the
// sitemap and the lists of other services. The words of each page live in
// locales/*.json under servicePages.items.<slug>.
export const SERVICE_SLUGS = [
  // Sites and design
  "landing",
  "vizitka",
  "corporate",
  "ecommerce",
  "wordpress",
  "design",
  // Promotion and advertising
  "seo",
  "seo-audit",
  "yandex-direct",
  "yandex-maps",
  // Applications and bots
  "web-apps",
  "react-nextjs",
  "telegram-bots",
  "telegram-mini-apps",
  "web3",
  // Data and support
  "parsing",
  "support",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const SERVICE_GROUPS = ["sites", "promotion", "apps", "data"] as const;
export type ServiceGroup = (typeof SERVICE_GROUPS)[number];

type ServiceConfig = {
  group: ServiceGroup;
  // Listed in the header menu. The rest are reached from the services hub.
  menu: boolean;
  // A starting price in rubles for the Service markup (the same figure the
  // price list on the home page shows). Null when the price depends on the task.
  priceFrom: number | null;
  // Indexes into portfolio.items: our own projects shown as examples.
  cases: readonly number[];
  // Services that go together with this one, shown at the bottom of the page.
  related: readonly ServiceSlug[];
};

export const SERVICE_CONFIG: Record<ServiceSlug, ServiceConfig> = {
  landing: { group: "sites", menu: true, priceFrom: 40000, cases: [2, 3], related: ["vizitka", "design", "seo", "yandex-direct"] },
  vizitka: { group: "sites", menu: false, priceFrom: 20000, cases: [3, 2], related: ["landing", "wordpress", "design", "yandex-maps"] },
  corporate: { group: "sites", menu: true, priceFrom: 60000, cases: [1], related: ["design", "seo", "support", "wordpress"] },
  ecommerce: { group: "sites", menu: true, priceFrom: 100000, cases: [0], related: ["design", "parsing", "seo", "support"] },
  wordpress: { group: "sites", menu: false, priceFrom: null, cases: [], related: ["corporate", "vizitka", "support", "seo"] },
  design: { group: "sites", menu: true, priceFrom: 20000, cases: [0, 1, 2], related: ["landing", "corporate", "ecommerce", "web-apps"] },
  seo: { group: "promotion", menu: true, priceFrom: 20000, cases: [], related: ["seo-audit", "yandex-direct", "yandex-maps", "support"] },
  "seo-audit": { group: "promotion", menu: false, priceFrom: null, cases: [], related: ["seo", "support", "yandex-direct", "corporate"] },
  "yandex-direct": { group: "promotion", menu: true, priceFrom: 20000, cases: [], related: ["seo", "landing", "yandex-maps", "seo-audit"] },
  "yandex-maps": { group: "promotion", menu: false, priceFrom: null, cases: [], related: ["seo", "yandex-direct", "vizitka", "landing"] },
  "web-apps": { group: "apps", menu: true, priceFrom: null, cases: [], related: ["react-nextjs", "design", "telegram-mini-apps", "support"] },
  "react-nextjs": { group: "apps", menu: false, priceFrom: null, cases: [], related: ["web-apps", "corporate", "design", "seo"] },
  "telegram-bots": { group: "apps", menu: true, priceFrom: null, cases: [], related: ["telegram-mini-apps", "web-apps", "parsing", "support"] },
  "telegram-mini-apps": { group: "apps", menu: false, priceFrom: null, cases: [], related: ["telegram-bots", "web-apps", "design", "web3"] },
  web3: { group: "apps", menu: false, priceFrom: null, cases: [], related: ["web-apps", "telegram-mini-apps", "react-nextjs", "design"] },
  parsing: { group: "data", menu: true, priceFrom: 30000, cases: [], related: ["ecommerce", "telegram-bots", "web-apps", "seo"] },
  support: { group: "data", menu: false, priceFrom: null, cases: [], related: ["seo", "wordpress", "corporate", "design"] },
};

export const isServiceSlug = (value: string): value is ServiceSlug =>
  (SERVICE_SLUGS as readonly string[]).includes(value);

export const SERVICES_PATH = "/services";
export const PRICES_PATH = "/prices";
export const servicePath = (slug: ServiceSlug) => `${SERVICES_PATH}/${slug}`;

export const MENU_SLUGS = SERVICE_SLUGS.filter((slug) => SERVICE_CONFIG[slug].menu);
export const slugsOf = (group: ServiceGroup) =>
  SERVICE_SLUGS.filter((slug) => SERVICE_CONFIG[slug].group === group);

// The words of one service page, as they sit in the locale files.
export type ServiceCopy = {
  // Short label for menus and cards.
  name: string;
  // The h1: built around the main search query of the page.
  title: string;
  metaTitle: string;
  metaDescription: string;
  // One sentence for the cards on the services hub.
  short: string;
  lead: string;
  price: string;
  term: string;
  bodyTitle: string;
  body: string[];
  includes: string[];
  fitTitle: string;
  fit: string[];
  steps: { title: string; text: string }[];
  faq: { q: string; a: string }[];
};

// The services with a published starting price (the same list as the price
// list on the home page) go into the table on /prices; the rest are priced
// per task after a brief.
export const PRICE_TABLE_SLUGS: readonly ServiceSlug[] = [
  "vizitka",
  "landing",
  "corporate",
  "ecommerce",
  "design",
  "web-apps",
  "seo",
  "yandex-direct",
  "parsing",
];
export const PER_TASK_SLUGS = SERVICE_SLUGS.filter((slug) => !PRICE_TABLE_SLUGS.includes(slug));
