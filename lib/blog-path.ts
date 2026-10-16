import { withLang, type Lang } from "./lang";

// Kept apart from lib/blog.ts, which reads files from disk and so must stay on
// the server: the header and footer (client components) only need the address.
export const BLOG_PATH = "/blog";
export const blogPath = (slug: string, lang: Lang = "ru") => withLang(`${BLOG_PATH}/${slug}`, lang);
