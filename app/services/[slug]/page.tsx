import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ru from "@/locales/ru.json";
import ServicePage from "@/components/services/ServicePage";
import { SERVICE_SLUGS, isServiceSlug, servicePath } from "@/lib/services";
import { SITE_NAME } from "@/lib/site";

// Only the six known services exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isServiceSlug(slug)) return {};
  // Metadata is rendered on the server, where the site speaks Russian; the
  // language switcher only changes what the visitor sees.
  const page = ru.servicePages.items[slug];
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: servicePath(slug) },
    // Metadata fields are merged shallowly: this openGraph replaces the whole
    // one from the layout, so site name, language and the preview image have to
    // be repeated here, and twitter is set to match (it would otherwise keep
    // the home page's text).
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "ru_RU",
      title: page.metaTitle,
      description: page.metaDescription,
      url: servicePath(slug),
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: page.metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: ["/opengraph-image"],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isServiceSlug(slug)) notFound();
  return <ServicePage slug={slug} />;
}
