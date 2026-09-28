// Order matters: it drives the menu, the sitemap and the "other services" list.
export const SERVICE_SLUGS = [
  "landing",
  "corporate",
  "ecommerce",
  "web-apps",
  "seo",
  "parsing",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const isServiceSlug = (value: string): value is ServiceSlug =>
  (SERVICE_SLUGS as readonly string[]).includes(value);

export const servicePath = (slug: ServiceSlug) => `/services/${slug}`;
