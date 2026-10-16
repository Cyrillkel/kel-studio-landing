import type { Metadata } from "next";
import ServiceRoute, { serviceMetadata, serviceStaticParams } from "@/components/routes/ServiceRoute";

// Only the known services exist; anything else is a 404. The address part is the
// English one (see SERVICE_SLUG_EN in lib/services.ts).
export const dynamicParams = false;

export const generateStaticParams = () => serviceStaticParams("en");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return serviceMetadata("en", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ServiceRoute lang="en" urlSlug={slug} />;
}
