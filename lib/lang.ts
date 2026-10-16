// Languages of the site. Russian is the main one and lives at the root of the
// site with no prefix (these addresses are already indexed); English lives
// under /en. Plain functions with no Node imports, so client components can
// use them too.
export const LANGS = ["ru", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "ru";
export const EN_PREFIX = "/en";

export const isLang = (value: unknown): value is Lang => value === "ru" || value === "en";

// "/services" -> "/en/services" in English, unchanged in Russian. The home page
// becomes "/en", and a hash stays where it was: "/#contact" -> "/en#contact".
export function withLang(path: string, lang: Lang): string {
  if (lang !== "en") return path;
  if (path === "/") return EN_PREFIX;
  if (path.startsWith("/#") || path.startsWith("/?")) return `${EN_PREFIX}${path.slice(1)}`;
  return `${EN_PREFIX}${path}`;
}

// The language of an address: everything under /en is English.
export function langFromPath(pathname: string): Lang {
  return pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`) ? "en" : "ru";
}

// "/en/prices" -> "/prices", "/en" -> "/". Russian addresses come back unchanged.
export function stripLang(pathname: string): string {
  if (pathname === EN_PREFIX) return "/";
  return pathname.startsWith(`${EN_PREFIX}/`) ? pathname.slice(EN_PREFIX.length) : pathname;
}

export const isHome = (pathname: string) => stripLang(pathname) === "/";

// The same page in each language, as the addresses it has there.
export type PathPair = Record<Lang, string>;
