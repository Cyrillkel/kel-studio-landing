import { langFromPath, stripLang, withLang, type Lang } from "./lang";
import { SERVICES_PATH, isServiceSlug, serviceFromUrlSlug, servicePath, serviceUrlSlug } from "./services";

// The address of the same page in the other language: for the language switcher.
// A service page is found by the service it describes (its address differs between
// the languages, see SERVICE_SLUG_EN in lib/services.ts), any other page by its path.
export function alternatePath(pathname: string, to: Lang): string {
  const from = langFromPath(pathname);
  if (from === to) return pathname;
  const bare = stripLang(pathname);
  const service = bare.match(new RegExp(`^${SERVICES_PATH}/([^/]+)$`));
  if (service) {
    const slug = serviceFromUrlSlug(service[1], from);
    if (slug) return servicePath(slug, to);
  }
  return withLang(bare, to);
}

// Turns an address written the Russian way ("/services/vizitka", "/#contact",
// "/blog/some-article") into the one for the language. Service pages are the
// only addresses whose words differ between the languages (see SERVICE_SLUG_EN in
// lib/services.ts). The texts of the site and the articles are written with the
// Russian-structure links, and this is what points them at the right pages.
export function localizePath(path: string, lang: Lang): string {
  if (lang === "ru") return path;
  const service = path.match(/^\/services\/([^/?#]+)(.*)$/);
  if (service && isServiceSlug(service[1])) {
    return withLang(`${SERVICES_PATH}/${serviceUrlSlug(service[1], lang)}${service[2]}`, lang);
  }
  return withLang(path, lang);
}
