import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ru from "@/locales/ru.json";
import ServicePage from "@/components/services/ServicePage";
import { SERVICE_SLUGS, isServiceSlug, servicePath } from "@/lib/services";

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
    openGraph: {
      type: "website",
      title: page.metaTitle,
      description: page.metaDescription,
      url: servicePath(slug),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isServiceSlug(slug)) notFound();
  return <ServicePage slug={slug} />;
}
