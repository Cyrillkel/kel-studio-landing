import BlogIndexRoute, { blogIndexMetadata } from "@/components/routes/BlogIndexRoute";

export const metadata = blogIndexMetadata("en");

export default function BlogIndex() {
  return <BlogIndexRoute lang="en" />;
}
