import type { MetadataRoute } from "next";
import { SERVICE_SLUGS, servicePath } from "@/lib/services";
import { hasPolicyText, readPrivacyHtml } from "@/lib/privacy";
import { CONTENT_UPDATED, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(CONTENT_UPDATED);
  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
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
            lastModified,
            changeFrequency: "yearly" as const,
            priority: 0.3,
          },
        ]
      : []),
  ];
}
