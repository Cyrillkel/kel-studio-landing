import type { Metadata } from "next";
import BlogPostRoute, { blogPostMetadata, blogStaticParams } from "@/components/routes/BlogPostRoute";

// Only the articles that exist in English; anything else is a 404.
export const dynamicParams = false;

export const generateStaticParams = () => blogStaticParams("en");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return blogPostMetadata("en", slug);
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogPostRoute lang="en" slug={slug} />;
}
