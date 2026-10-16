import { BLOG_PATH, blogPath, getPosts } from "./blog";
import { getDictionary } from "./dictionary";
import { withLang, type Lang } from "./lang";
import { SITE_URL } from "./site";

const esc = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// A feed of a language's articles for readers and aggregators: title, summary, date.
// The routes app/(ru)/blog/rss.xml and app/(en)/en/blog/rss.xml return it.
export function rssResponse(lang: Lang): Response {
  const blog = getDictionary(lang).blog;
  const items = getPosts(lang)
    .map(
      (post) => `    <item>
      <title>${esc(post.title)}</title>
      <link>${SITE_URL}${blogPath(post.slug, lang)}</link>
      <guid isPermaLink="true">${SITE_URL}${blogPath(post.slug, lang)}</guid>
      <pubDate>${new Date(`${post.date}T09:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(post.description)}</description>
    </item>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(blog.rssTitle)}</title>
    <link>${SITE_URL}${withLang(BLOG_PATH, lang)}</link>
    <description>${esc(blog.rssDescription)}</description>
    <language>${lang}</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
