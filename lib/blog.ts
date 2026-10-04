import fs from "node:fs";
import path from "node:path";
import { Marked } from "marked";
import { isServiceSlug, type ServiceSlug } from "./services";

export { BLOG_PATH, blogPath } from "./blog-path";

// Articles are Markdown files in content/blog/<slug>.md, read at build time (the
// pages and the sitemap are static). The slug is the file name and the address.
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
const DIR = path.join(process.cwd(), "content", "blog");

export const CATEGORIES = {
  sites: "Создание сайта",
  seo: "SEO и аналитика",
  ads: "Реклама",
  apps: "Боты и приложения",
} as const;
export type CategoryId = keyof typeof CATEGORIES;

// Signed by the studio's admin, not a named person.
export const AUTHOR = { name: "Админ" };

export type Heading = { id: string; text: string };

export type Post = {
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

// Turns the Markdown body into HTML and collects the h2 headings for the table
// of contents. The text is ours (it lives in the repository), so it is not
// sanitised. Tables get a scrolling wrapper, outside links open in a new tab.
function render(markdown: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const taken = new Set<string>();
  const html = (marked.parse(markdown, { async: false }) as string)
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
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
  return { html, headings };
}

function parseFile(slug: string, raw: string): (Post & { draft: boolean }) | null {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const at = line.indexOf(":");
    if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  const { title, description, category, date, service } = meta;
  if (!title || !description || !date || !(category in CATEGORIES) || !isServiceSlug(service)) {
    throw new Error(`content/blog/${slug}.md: title, description, date, category and service are required (and must be valid)`);
  }
  const body = match[2].trim();
  const { html, headings } = render(body);
  const words = stripTags(html).split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title,
    description,
    category: category as CategoryId,
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

// Published articles, newest first.
export function getPosts(): Post[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  const posts: Post[] = [];
  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const post = parseFile(slug, fs.readFileSync(path.join(DIR, file), "utf8"));
    if (post && !post.draft) posts.push(post);
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug);

// "2026-10-04" -> "4 октября 2026".
export function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// The latest edit of any article, for the sitemap entry of the blog index.
export const latestUpdate = (posts: Post[]) =>
  posts.reduce((max, p) => (p.updated > max ? p.updated : max), "");
