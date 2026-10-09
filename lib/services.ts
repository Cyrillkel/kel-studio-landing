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
  "google-ads",
  "vk-ads",
  "telegram-ads",
  "yandex-maps",
  // Applications and bots
  "web-apps",
  "react-nextjs",
  "telegram-bots",
  "telegram-mini-apps",
  "web3",
  // AI and automation
  "ai-assistants",
  "mcp-servers",
  // Data and support
  "parsing",
  "support",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const SERVICE_GROUPS = ["sites", "promotion", "apps", "ai", "data"] as const;
export type ServiceGroup = (typeof SERVICE_GROUPS)[number];

type ServiceConfig = {
  group: ServiceGroup;
  // Listed in the header menu. The rest are reached from the services hub.
  menu: boolean;
  // A starting price in rubles for the Service markup (the same figure the
  // price list on the home page shows). Null when the price depends on the task.
  priceFrom: number | null;
  // "HUR" when the price is per hour (web applications).
  priceUnit?: "HUR";
  // Indexes into portfolio.items: our own projects shown as examples.
  cases: readonly number[];
  // Services that go together with this one, shown at the bottom of the page.
  related: readonly ServiceSlug[];
};

export const SERVICE_CONFIG: Record<ServiceSlug, ServiceConfig> = {
  landing: { group: "sites", menu: true, priceFrom: 50000, cases: [0, 3, 4], related: ["vizitka", "corporate", "yandex-direct", "yandex-maps"] },
  vizitka: { group: "sites", menu: false, priceFrom: 20000, cases: [5, 4, 3], related: ["landing", "wordpress", "yandex-maps", "seo"] },
  corporate: { group: "sites", menu: true, priceFrom: 100000, cases: [2], related: ["wordpress", "seo-audit", "support", "design"] },
  ecommerce: { group: "sites", menu: true, priceFrom: 150000, cases: [1], related: ["wordpress", "react-nextjs", "parsing", "vk-ads"] },
  wordpress: { group: "sites", menu: false, priceFrom: null, cases: [5], related: ["corporate", "vizitka", "support", "seo-audit"] },
  design: { group: "sites", menu: true, priceFrom: 20000, cases: [0, 1, 2], related: ["landing", "vizitka", "corporate", "web-apps"] },
  seo: { group: "promotion", menu: true, priceFrom: 20000, cases: [], related: ["seo-audit", "yandex-direct", "google-ads", "yandex-maps"] },
  "seo-audit": { group: "promotion", menu: false, priceFrom: null, cases: [], related: ["seo", "support", "yandex-direct", "corporate"] },
  "yandex-direct": { group: "promotion", menu: true, priceFrom: 20000, cases: [], related: ["google-ads", "vk-ads", "landing", "seo"] },
  "google-ads": { group: "promotion", menu: false, priceFrom: null, cases: [], related: ["yandex-direct", "vk-ads", "landing", "seo"] },
  "vk-ads": { group: "promotion", menu: false, priceFrom: null, cases: [], related: ["telegram-ads", "yandex-direct", "google-ads", "landing"] },
  "telegram-ads": { group: "promotion", menu: false, priceFrom: null, cases: [], related: ["vk-ads", "telegram-bots", "yandex-direct", "google-ads"] },
  "yandex-maps": { group: "promotion", menu: false, priceFrom: null, cases: [], related: ["seo", "yandex-direct", "vizitka", "seo-audit"] },
  "web-apps": { group: "apps", menu: true, priceFrom: 2000, priceUnit: "HUR", cases: [], related: ["react-nextjs", "telegram-mini-apps", "web3", "mcp-servers"] },
  "react-nextjs": { group: "apps", menu: false, priceFrom: null, cases: [], related: ["web-apps", "web3", "telegram-mini-apps", "corporate"] },
  "telegram-bots": { group: "apps", menu: true, priceFrom: null, cases: [], related: ["telegram-ads", "telegram-mini-apps", "ai-assistants", "parsing"] },
  "telegram-mini-apps": { group: "apps", menu: false, priceFrom: null, cases: [], related: ["telegram-bots", "react-nextjs", "web3", "telegram-ads"] },
  web3: { group: "apps", menu: false, priceFrom: null, cases: [], related: ["web-apps", "telegram-mini-apps", "react-nextjs", "telegram-bots"] },
  // Both AI services are priced per task, so no starting price goes into the markup.
  "ai-assistants": { group: "ai", menu: true, priceFrom: null, cases: [], related: ["mcp-servers", "telegram-bots", "web-apps", "corporate"] },
  "mcp-servers": { group: "ai", menu: true, priceFrom: null, cases: [], related: ["ai-assistants", "web-apps", "parsing", "support"] },
  parsing: { group: "data", menu: true, priceFrom: 30000, cases: [], related: ["ecommerce", "telegram-bots", "web-apps", "ai-assistants"] },
  support: { group: "data", menu: false, priceFrom: null, cases: [], related: ["wordpress", "corporate", "seo-audit", "design"] },
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
  // The button text: names what the visitor gets, e.g. "Рассчитать лендинг".
  cta: string;
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

// Page text may carry internal links as [label](/path); the structured data
// for search engines gets the label only.
export const plainText = (text: string) => text.replace(/\[([^\]]+)\]\(\/[^)\s]*\)/g, "$1");
