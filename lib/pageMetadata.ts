import type { Metadata } from "next";
import { SITE_NAME } from "./site";

// Metadata fields are merged shallowly: a page's openGraph replaces the whole
// one from app/layout.tsx, so site name, language and the preview image have to
// be repeated, and twitter is set to match (it would otherwise keep the home
// page's text).
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "ru_RU",
      title,
      description,
      url: path,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
