import type { Metadata } from "next";
import ServiceRoute, { serviceMetadata, serviceStaticParams } from "@/components/routes/ServiceRoute";

// Only the known services exist; anything else is a 404.
export const dynamicParams = false;

export const generateStaticParams = () => serviceStaticParams("ru");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return serviceMetadata("ru", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ServiceRoute lang="ru" urlSlug={slug} />;
}
