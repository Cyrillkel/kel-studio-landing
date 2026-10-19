import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { BLOG_PATH, CATEGORIES, blogPath, formatDate, getPosts, latestUpdate } from "@/lib/blog";
import { getDictionary } from "@/lib/dictionary";
import { withLang, type Lang, type PathPair } from "@/lib/lang";
import { languageAlternates, pageMetadata } from "@/lib/pageMetadata";
import { breadcrumbNode, graph, webPageNode } from "@/lib/schema";
import { SITE_URL, TELEGRAM_CHANNEL_URL } from "@/lib/site";
import { fill } from "@/lib/text";

// The blog's list of articles (/blog, /en/blog).
export const blogIndexPaths: PathPair = { ru: BLOG_PATH, en: withLang(BLOG_PATH, "en") };

// The two lists are each other's twin only while both have articles.
export const blogIndexPathsFor = (lang: Lang): Partial<PathPair> =>
  getPosts("ru").length > 0 && getPosts("en").length > 0 ? blogIndexPaths : { [lang]: blogIndexPaths[lang] };

export function blogIndexMetadata(lang: Lang): Metadata {
  const blog = getDictionary(lang).blog;
  const paths = blogIndexPathsFor(lang);
  return {
    ...pageMetadata({ lang, title: blog.metaTitle, description: blog.metaDescription, paths }),
    alternates: {
      ...languageAlternates(paths, lang),
      types: { "application/rss+xml": `${SITE_URL}${blogIndexPaths[lang]}/rss.xml` },
    },
  };
}

export default function BlogIndexRoute({ lang }: { lang: Lang }) {
  const blog = getDictionary(lang).blog;
  const posts = getPosts(lang);
  const path = blogIndexPaths[lang];
  const home = withLang("/", lang);
  const structuredData = graph(
    [
      webPageNode({
        path,
        name: blog.metaTitle,
        description: blog.metaDescription,
        lang,
        type: "CollectionPage",
        breadcrumb: true,
        modified: latestUpdate(posts) || undefined,
      }),
      breadcrumbNode(path, [
        { name: blog.home, path: home },
        { name: blog.title, path },
      ]),
    ],
    { lang }
  );

  return (
    <>
      <Navigation />
      <SmoothScroll>
        <JsonLd data={structuredData} />
        <div className="blog-page flex min-h-screen flex-col">
          <main className="flex-1">
            <div className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-6 pt-32 md:pt-40">
              <Breadcrumbs label={blog.crumbsLabel} items={[{ name: blog.home, href: home }, { name: blog.title }]} />
              <h1 className="blog-heading text-[clamp(1.75rem,6vw,3rem)] font-bold leading-tight">{blog.title}</h1>
              <p className="blog-text mt-4 max-w-2xl text-lg leading-relaxed">
                {blog.introBefore}
                <a className="blog-link underline underline-offset-4" href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
                  {blog.introLink}
                </a>
                {blog.introAfter}
              </p>

              {posts.length === 0 ? (
                <p className="blog-muted mt-16">{blog.empty}</p>
              ) : (
                <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <li key={post.slug}>
                      <Link href={blogPath(post.slug, lang)} className="blog-card flex h-full flex-col p-6">
                        <span className="blog-chip self-start">{CATEGORIES[lang][post.category]}</span>
                        <h2 className="blog-heading mt-4 text-xl font-bold leading-snug">{post.title}</h2>
                        <p className="blog-text mt-3 flex-1 leading-relaxed">{post.description}</p>
                        <p className="blog-muted mt-5 text-sm">
                          <time dateTime={post.date}>{formatDate(post.date, lang)}</time> · {fill(blog.minutes, { count: post.minutes })}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </main>
          <Footer />
        </div>
      </SmoothScroll>
    </>
  );
}
