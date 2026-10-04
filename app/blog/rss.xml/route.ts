import { BLOG_PATH, blogPath, getPosts } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const esc = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// A feed of the articles for readers and aggregators: title, summary, date.
export function GET() {
  const posts = getPosts();
  const items = posts
    .map(
      (post) => `    <item>
      <title>${esc(post.title)}</title>
      <link>${SITE_URL}${blogPath(post.slug)}</link>
      <guid isPermaLink="true">${SITE_URL}${blogPath(post.slug)}</guid>
      <pubDate>${new Date(`${post.date}T09:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(post.description)}</description>
    </item>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(`Блог ${SITE_NAME}`)}</title>
    <link>${SITE_URL}${BLOG_PATH}</link>
    <description>Статьи студии KEL Studio о сайтах, SEO, рекламе и ботах</description>
    <language>ru</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
