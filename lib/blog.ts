import fs from "node:fs";
import path from "node:path";
import { Marked } from "marked";
import { localizePath } from "./routes";
import { isServiceSlug, type ServiceSlug } from "./services";
import type { Lang } from "./lang";

export { BLOG_PATH, blogPath } from "./blog-path";

// Articles are Markdown files, read at build time (the pages and the sitemap are
// static): the Russian ones in content/blog/<slug>.md, the English ones in
// content/blog/en/<slug>.md. The slug is the file name and the address, and an
// article has the same slug in both languages, which is how the two versions are
// matched (hreflang, the language switcher). An article without a translation
// simply does not appear on the English pages.
// A file starts with a block of "key: value" lines between two "---" lines:
//   title        H1 and the base of <title>
//   description  meta description and the card text (140-160 characters)
//   category     one of CATEGORIES
//   date         first published, YYYY-MM-DD
//   updated      last substantive edit, YYYY-MM-DD (defaults to date)
//   service      the service page the article leads to (a SERVICE_SLUGS value)
//   query        the main search query, for our own reference
//   related      comma-separated slugs of neighbouring articles
//   draft        "true" keeps the article out of the build, the list and the sitemap
// File access is written out for each folder (rather than looked up in a table): the
// build traces which files a page can read from the shape of path.join(process.cwd(),
// "content", ...), and a path built from a variable makes it include the whole project.
const listArticles = (lang: Lang): string[] =>
  lang === "en"
    ? fs.readdirSync(path.join(process.cwd(), "content", "blog", "en"))
    : fs.readdirSync(path.join(process.cwd(), "content", "blog"));

const readArticle = (lang: Lang, file: string): string =>
  lang === "en"
    ? fs.readFileSync(path.join(process.cwd(), "content", "blog", "en", file), "utf8")
    : fs.readFileSync(path.join(process.cwd(), "content", "blog", file), "utf8");

export const CATEGORIES: Record<Lang, Record<"sites" | "seo" | "ads" | "apps", string>> = {
  ru: {
    sites: "Создание сайта",
    seo: "SEO и аналитика",
    ads: "Реклама",
    apps: "Боты и приложения",
  },
  en: {
    sites: "Websites",
    seo: "SEO and analytics",
    ads: "Advertising",
    apps: "Bots and apps",
  },
};
export type CategoryId = keyof (typeof CATEGORIES)["ru"];
const isCategory = (value: string): value is CategoryId => value in CATEGORIES.ru;

// Signed by the studio's admin, not a named person.
export const AUTHOR: Record<Lang, { name: string }> = {
  ru: { name: "Админ" },
  en: { name: "Admin" },
};

export type Heading = { id: string; text: string };

export type Post = {
  lang: Lang;
  slug: string;
  title: string;
  description: string;
  category: CategoryId;
  date: string;
  updated: string;
  service: ServiceSlug;
  related: string[];
  minutes: number;
  html: string;
  headings: Heading[];
};

const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
  х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[а-яё]/g, (c) => TRANSLIT[c] ?? "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const stripTags = (html: string) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const marked = new Marked({ gfm: true });

// Article images live in public/blog/<slug>/ and are written as ![alt](/blog/<slug>/name.webp).
// Their size is read from the file header, so the page reserves the space before the image
// loads. Only PNG and WebP are understood; anything else is left without a size.
function imageSize(src: string): { width: number; height: number } | null {
  try {
    const fd = fs.openSync(path.join(process.cwd(), "public", src), "r");
    const head = Buffer.alloc(32);
    fs.readSync(fd, head, 0, 32, 0);
    fs.closeSync(fd);
    if (head.toString("latin1", 1, 4) === "PNG") {
      return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
    }
    if (head.toString("latin1", 0, 4) === "RIFF" && head.toString("latin1", 8, 12) === "WEBP") {
      const kind = head.toString("latin1", 12, 16);
      if (kind === "VP8 ") return { width: head.readUInt16LE(26) & 0x3fff, height: head.readUInt16LE(28) & 0x3fff };
      if (kind === "VP8L") {
        const bits = head.readUInt32LE(21);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
      if (kind === "VP8X") return { width: head.readUIntLE(24, 3) + 1, height: head.readUIntLE(27, 3) + 1 };
    }
  } catch {
    // A missing or unreadable file just means no size attributes.
  }
  return null;
}

// Turns the Markdown body into HTML and collects the h2 headings for the table
// of contents. The text is ours (it lives in the repository), so it is not
// sanitised. Tables get a scrolling wrapper, outside links open in a new tab,
// images get their size and load lazily (a cover above the first heading loads at once).
// Links to the site are written the Russian way in both languages ("/services/seo",
// "/blog/some-article") and pointed at the page of the article's language here.
function render(markdown: string, lang: Lang): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const taken = new Set<string>();
  const parsed = marked.parse(markdown, { async: false }) as string;
  const firstImage = parsed.indexOf("<img ");
  const firstHeading = parsed.indexOf("<h2>");
  const coverFirst = firstImage !== -1 && (firstHeading === -1 || firstImage < firstHeading);
  let images = 0;
  const html = parsed
    .replace(/<img src="(\/[^"]+)" alt="([^"]*)"([^>]*)>/g, (_m, src: string, alt: string, rest: string) => {
      const size = imageSize(src);
      const urgent = coverFirst && images++ === 0;
      return `<img src="${src}" alt="${alt}"${rest}${size ? ` width="${size.width}" height="${size.height}"` : ""} decoding="async"${urgent ? ' fetchpriority="high"' : ' loading="lazy"'}>`;
    })
    .replace(/<h2>([\s\S]*?)<\/h2>/g, (_m, inner: string) => {
      const text = stripTags(inner);
      let id = slugify(text) || `section-${headings.length + 1}`;
      while (taken.has(id)) id += "-2";
      taken.add(id);
      headings.push({ id, text });
      return `<h2 id="${id}">${inner}</h2>`;
    })
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, "</table></div>")
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"')
    .replace(/<a href="(\/(?!\/)[^"]*)"/g, (_m, href: string) => `<a href="${localizePath(href, lang)}"`);
  return { html, headings };
}

function parseFile(lang: Lang, slug: string, raw: string): (Post & { draft: boolean }) | null {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const at = line.indexOf(":");
    if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  const { title, description, category, date, service } = meta;
  if (!title || !description || !date || !isCategory(category) || !isServiceSlug(service)) {
    throw new Error(`${lang === "en" ? "content/blog/en" : "content/blog"}/${slug}.md: title, description, date, category and service are required (and must be valid)`);
  }
  const body = match[2].trim();
  const { html, headings } = render(body, lang);
  const words = stripTags(html).split(/\s+/).filter(Boolean).length;
  return {
    lang,
    slug,
    title,
    description,
    category,
    date,
    updated: meta.updated || date,
    service,
    related: (meta.related ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    minutes: Math.max(1, Math.round(words / 200)),
    html,
    headings,
    draft: meta.draft === "true",
  };
}

// Published articles of a language, newest first.
export function getPosts(lang: Lang = "ru"): Post[] {
  let files: string[] = [];
  try {
    files = listArticles(lang).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  const posts: Post[] = [];
  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const post = parseFile(lang, slug, readArticle(lang, file));
    if (post && !post.draft) posts.push(post);
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export const getPost = (slug: string, lang: Lang = "ru") => getPosts(lang).find((p) => p.slug === slug);

// "2026-10-04" -> "4 октября 2026" / "October 4, 2026".
export function formatDate(iso: string, lang: Lang = "ru"): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(lang === "en" ? "en-US" : "ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// The latest edit of any article, for the sitemap entry of the blog index.
export const latestUpdate = (posts: Post[]) =>
  posts.reduce((max, p) => (p.updated > max ? p.updated : max), "");
