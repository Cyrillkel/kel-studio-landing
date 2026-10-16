import BlogIndexRoute, { blogIndexMetadata } from "@/components/routes/BlogIndexRoute";

export const metadata = blogIndexMetadata("ru");

export default function BlogIndex() {
  return <BlogIndexRoute lang="ru" />;
}
