import type { MetadataRoute } from "next";
import { PRICES_PATH, SERVICE_SLUGS, SERVICES_PATH, servicePath } from "@/lib/services";
import { BLOG_PATH, blogPath, getPosts, latestUpdate } from "@/lib/blog";
import { POLICY_UPDATED, hasPolicyText, readPrivacyHtml } from "@/lib/privacy";
import { CONTENT_UPDATED, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(CONTENT_UPDATED);
  const posts = getPosts();
  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}${SERVICES_PATH}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}${PRICES_PATH}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...(posts.length
      ? [
          {
            url: `${SITE_URL}${BLOG_PATH}`,
            lastModified: new Date(latestUpdate(posts)),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          },
          ...posts.map((post) => ({
            url: `${SITE_URL}${blogPath(post.slug)}`,
            lastModified: new Date(post.updated),
            changeFrequency: "monthly" as const,
            priority: 0.6,
          })),
        ]
      : []),
    ...SERVICE_SLUGS.map((slug) => ({
      url: `${SITE_URL}${servicePath(slug)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // Only once content/privacy.html has the text (see app/privacy/page.tsx).
    ...(hasPolicyText(readPrivacyHtml())
      ? [
          {
            url: `${SITE_URL}/privacy`,
            lastModified: new Date(POLICY_UPDATED),
            changeFrequency: "yearly" as const,
            priority: 0.3,
          },
        ]
      : []),
  ];
}
