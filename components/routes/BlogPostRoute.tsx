import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ContactModal from "@/components/ContactModal";
import StickyAside from "@/components/blog/StickyAside";
import { ButtonLink } from "@/components/Button";
import { AUTHOR, BLOG_PATH, CATEGORIES, blogPath, formatDate, getPost, getPosts, type Post } from "@/lib/blog";
import { getDictionary } from "@/lib/dictionary";
import { LANGS, withLang, type Lang, type PathPair } from "@/lib/lang";
import { pageMetadata } from "@/lib/pageMetadata";
import { articleNode, breadcrumbNode, graph, webPageNode } from "@/lib/schema";
import { servicePath } from "@/lib/services";
import { TELEGRAM_CHANNEL_URL } from "@/lib/site";
import { fill, lowerFirstWord } from "@/lib/text";

// An article (/blog/<slug>, /en/blog/<slug>).
export const blogStaticParams = (lang: Lang) => getPosts(lang).map((post) => ({ slug: post.slug }));

// The article in the languages it exists in: each version names the other as its twin.
const postPaths = (slug: string, lang: Lang): Partial<PathPair> => {
  const paths: Partial<PathPair> = {};
  for (const other of LANGS) if (getPost(slug, other)) paths[other] = blogPath(slug, other);
  return paths[lang] ? paths : { [lang]: blogPath(slug, lang) };
};

export function blogPostMetadata(lang: Lang, slug: string): Metadata {
  const post = getPost(slug, lang);
  if (!post) return {};
  const base = pageMetadata({ lang, title: post.title, description: post.description, paths: postPaths(slug, lang) });
  // The card drawn for this article (opengraph-image.tsx next to the article's route).
  const image = `${blogPath(slug, lang)}/opengraph-image`;
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [AUTHOR[lang].name],
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { ...base.twitter, images: [image] },
  };
}

export default function BlogPostRoute({ lang, slug }: { lang: Lang; slug: string }) {
  const post = getPost(slug, lang);
  if (!post) notFound();

  const dict = getDictionary(lang);
  const blog = dict.blog;
  const home = withLang("/", lang);
  const path = blogPath(slug, lang);
  const service = dict.servicePages.items[post.service];
  const all = getPosts(lang).filter((p) => p.slug !== slug);
  // Neighbours named in the article first, then others from the same category.
  const more = [
    ...post.related.flatMap((s) => all.filter((p) => p.slug === s)),
    ...all.filter((p) => p.category === post.category && !post.related.includes(p.slug)),
  ].slice(0, 3);
  const minutes = fill(blog.minutes, { count: post.minutes });

  const structuredData = graph(
    [
      webPageNode({
        path,
        name: post.title,
        description: post.description,
        lang,
        type: "WebPage",
        breadcrumb: true,
        modified: post.updated,
        mainEntityId: `${articleNode(post)["@id"]}`,
      }),
      breadcrumbNode(path, [
        { name: blog.home, path: home },
        { name: blog.title, path: withLang(BLOG_PATH, lang) },
        { name: post.title, path },
      ]),
      articleNode(post),
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
            <article className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-6 pt-32 md:pt-40">
              <Breadcrumbs
                label={blog.crumbsLabel}
                items={[
                  { name: blog.home, href: home },
                  { name: blog.title, href: withLang(BLOG_PATH, lang) },
                  { name: CATEGORIES[lang][post.category] },
                ]}
              />
              <header className="max-w-5xl">
                <span className="blog-chip">{CATEGORIES[lang][post.category]}</span>
                <h1 className="blog-heading mt-5 text-[clamp(1.5rem,5.5vw,2.75rem)] font-bold leading-tight">{post.title}</h1>
                <p className="blog-muted mt-5 text-sm leading-relaxed">
                  {AUTHOR[lang].name} · <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
                  {post.updated !== post.date && (
                    <>
                      {" "}
                      · {blog.updated} <time dateTime={post.updated}>{formatDate(post.updated, lang)}</time>
                    </>
                  )}{" "}
                  · {minutes}
                </p>
              </header>

              {/* The text fills the container's left part, the contents and the contact card the
                  right one. On a phone it is one column: the contents first, then the text. */}
              <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-x-16">
                <aside className="lg:col-start-2 lg:row-start-1">
                  <StickyAside>
                    {post.headings.length >= 3 && (
                      <nav aria-label={blog.contents} className="blog-card p-5">
                        <p className="blog-heading text-sm font-bold">{blog.contents}</p>
                        <ol className="blog-text mt-3 list-decimal space-y-1.5 pl-5 text-[0.9375rem] leading-snug">
                          {post.headings.map((h) => (
                            <li key={h.id}>
                              <a className="blog-link" href={`#${h.id}`}>
                                {h.text}
                              </a>
                            </li>
                          ))}
                        </ol>
                      </nav>
                    )}
                    <div className="blog-card mt-6 hidden p-5 lg:block">
                      <HelpCard post={post} serviceName={service.name} lang={lang} />
                    </div>
                  </StickyAside>
                </aside>

                <div className="min-w-0 lg:col-start-1 lg:row-start-1">
                  <div className="prose-blog" dangerouslySetInnerHTML={{ __html: post.html }} />

                  <aside className="blog-card mt-14 p-6 sm:p-8 lg:hidden">
                    <HelpCard post={post} serviceName={service.name} lang={lang} />
                  </aside>

                  <footer className="mt-10 border-t pt-8" style={{ borderColor: "var(--doc-line)" }}>
                    <p className="blog-heading text-base font-bold">{fill(blog.author, { name: AUTHOR[lang].name })}</p>
                    <p className="blog-text mt-2 leading-relaxed">
                      {blog.aboutBefore}
                      <a className="blog-link underline underline-offset-4" href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
                        {blog.aboutLink}
                      </a>
                      {blog.aboutAfter}
                    </p>
                  </footer>
                </div>
              </div>
            </article>

            {more.length > 0 && (
              <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-6">
                <h2 className="blog-heading text-2xl font-bold">{blog.more}</h2>
                <ul className="mt-8 grid gap-6 md:grid-cols-3">
                  {more.map((p) => (
                    <li key={p.slug}>
                      <Link href={blogPath(p.slug, lang)} className="blog-card flex h-full flex-col p-6">
                        <span className="blog-chip self-start">{CATEGORIES[lang][p.category]}</span>
                        <span className="blog-heading mt-4 text-lg font-bold leading-snug">{p.title}</span>
                        <span className="blog-muted mt-4 text-sm">{fill(blog.minutes, { count: p.minutes })}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </main>
          <Footer />
        </div>
      </SmoothScroll>
    </>
  );
}

// "Need help" card: the text, the form button and a link to the service page. It sits in
// the side column on a wide screen and at the end of the article on a narrow one.
function HelpCard({ post, serviceName, lang }: { post: Post; serviceName: string; lang: Lang }) {
  const dict = getDictionary(lang);
  return (
    <>
      <p className="blog-heading text-xl font-bold leading-snug">
        {fill(dict.blog.helpTitle, { service: lowerFirstWord(serviceName, lang) })}
      </p>
      <p className="blog-text mt-3 leading-relaxed">{dict.blog.helpText}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <ContactModal place={`Блог: ${post.title}`} service={post.service} size="md">
          {dict.servicePages.common.ctaButton}
        </ContactModal>
        <ButtonLink href={servicePath(post.service, lang)} variant="outline" size="md">
          {serviceName}
        </ButtonLink>
      </div>
    </>
  );
}
