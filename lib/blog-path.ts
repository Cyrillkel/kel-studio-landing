// Kept apart from lib/blog.ts, which reads files from disk and so must stay on
// the server: the header and footer (client components) only need the address.
export const BLOG_PATH = "/blog";
export const blogPath = (slug: string) => `${BLOG_PATH}/${slug}`;
