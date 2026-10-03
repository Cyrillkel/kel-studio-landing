import type { MetadataRoute } from "next";
import { INDEXABLE, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: INDEXABLE
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    // Crawlers find the sitemap here without anyone submitting it by hand.
    ...(INDEXABLE ? { sitemap: `${SITE_URL}/sitemap.xml` } : {}),
  };
}
