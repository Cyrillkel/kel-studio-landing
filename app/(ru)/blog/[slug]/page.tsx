import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ru from "@/locales/ru.json";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ContactModal from "@/components/ContactModal";
import StickyAside from "@/components/blog/StickyAside";
import { ButtonLink } from "@/components/Button";
import { AUTHOR, BLOG_PATH, CATEGORIES, blogPath, formatDate, getPost, getPosts, type Post } from "@/lib/blog";
import { pageMetadata } from "@/lib/pageMetadata";
import { articleNode, breadcrumbNode, graph, webPageNode } from "@/lib/schema";
import { servicePath } from "@/lib/services";
import { TELEGRAM_CHANNEL_URL } from "@/lib/site";

// Only the articles that exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const base = pageMetadata({ title: post.title, description: post.description, path: blogPath(slug) });
  // The card drawn for this article (opengraph-image.tsx next to this file).
  const image = `${blogPath(slug)}/opengraph-image`;
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [AUTHOR.name],
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { ...base.twitter, images: [image] },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const path = blogPath(slug);
  const service = ru.servicePages.items[post.service];
  const all = getPosts().filter((p) => p.slug !== slug);
  // Neighbours named in the article first, then others from the same category.
  const more = [
    ...post.related.flatMap((s) => all.filter((p) => p.slug === s)),
    ...all.filter((p) => p.category === post.category && !post.related.includes(p.slug)),
  ].slice(0, 3);

  const structuredData = graph([
    webPageNode({
      path,
      name: post.title,
      description: post.description,
      type: "WebPage",
      breadcrumb: true,
      modified: post.updated,
      mainEntityId: `${articleNode(post)["@id"]}`,
    }),
    breadcrumbNode(path, [
      { name: "Главная", path: "/" },
      { name: "Блог", path: BLOG_PATH },
      { name: post.title, path },
    ]),
    articleNode(post),
  ]);

  return (
    <>
      <Navigation />
      <SmoothScroll>
        <JsonLd data={structuredData} />
        <div className="blog-page flex min-h-screen flex-col">
          <main className="flex-1">
            <article className="mx-auto w-full max-w-7xl px-6 pb-20 pt-32 md:pt-40">
              <Breadcrumbs
                label="Хлебные крошки"
                items={[{ name: "Главная", href: "/" }, { name: "Блог", href: BLOG_PATH }, { name: CATEGORIES[post.category] }]}
              />
              <header className="max-w-5xl">
                <span className="blog-chip">{CATEGORIES[post.category]}</span>
                <h1 className="blog-heading mt-5 text-[clamp(1.5rem,5.5vw,2.75rem)] font-bold leading-tight">{post.title}</h1>
                <p className="blog-muted mt-5 text-sm leading-relaxed">
                  {AUTHOR.name} · <time dateTime={post.date}>{formatDate(post.date)}</time>
                  {post.updated !== post.date && (
                    <>
                      {" "}
                      · обновлено <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                    </>
                  )}{" "}
                  · {post.minutes} мин чтения
                </p>
              </header>

              {/* The text fills the container's left part, the contents and the contact card the
                  right one. On a phone it is one column: the contents first, then the text. */}
              <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-x-16">
                <aside className="lg:col-start-2 lg:row-start-1">
                  <StickyAside>
                    {post.headings.length >= 3 && (
                      <nav aria-label="Содержание" className="blog-card p-5">
                        <p className="blog-heading text-sm font-bold">Содержание</p>
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
                      <HelpCard post={post} serviceName={service.name} />
                    </div>
                  </StickyAside>
                </aside>

                <div className="min-w-0 lg:col-start-1 lg:row-start-1">
                  <div className="prose-blog" dangerouslySetInnerHTML={{ __html: post.html }} />

                  <aside className="blog-card mt-14 p-6 sm:p-8 lg:hidden">
                    <HelpCard post={post} serviceName={service.name} />
                  </aside>

                  <footer className="mt-10 border-t pt-8" style={{ borderColor: "var(--doc-line)" }}>
                    <p className="blog-heading text-base font-bold">{AUTHOR.name}, KEL Studio</p>
                    <p className="blog-text mt-2 leading-relaxed">
                      Делаем сайты, продвижение и боты для бизнеса. Короткие заметки по теме выходят в{" "}
                      <a className="blog-link underline underline-offset-4" href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
                        Telegram-канале студии
                      </a>
                      .
                    </p>
                  </footer>
                </div>
              </div>
            </article>

            {more.length > 0 && (
              <section className="mx-auto w-full max-w-7xl px-6 pb-24">
                <h2 className="blog-heading text-2xl font-bold">Читайте также</h2>
                <ul className="mt-8 grid gap-6 md:grid-cols-3">
                  {more.map((p) => (
                    <li key={p.slug}>
                      <Link href={blogPath(p.slug)} className="blog-card flex h-full flex-col p-6">
                        <span className="blog-chip self-start">{CATEGORIES[p.category]}</span>
                        <span className="blog-heading mt-4 text-lg font-bold leading-snug">{p.title}</span>
                        <span className="blog-muted mt-4 text-sm">{p.minutes} мин чтения</span>
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

// "Лендинги" -> "лендинги", but "SEO-аудит" and "Telegram-боты" stay as they are.
const lowerFirstRussian = (text: string) =>
  /^[А-ЯЁ][а-яё]/.test(text) ? text[0].toLowerCase() + text.slice(1) : text;

// "Need help" card: the text, the form button and a link to the service page. It sits in
// the side column on a wide screen and at the end of the article on a narrow one.
function HelpCard({ post, serviceName }: { post: Post; serviceName: string }) {
  return (
    <>
      <p className="blog-heading text-xl font-bold leading-snug">Нужна помощь: {lowerFirstRussian(serviceName)}</p>
      <p className="blog-text mt-3 leading-relaxed">
        Опишите задачу в заявке. Вернёмся с решением, сроком и ценой, которые зафиксируем в договоре.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <ContactModal place={`Блог: ${post.title}`} service={post.service} size="md">
          {ru.servicePages.common.ctaButton}
        </ContactModal>
        <ButtonLink href={servicePath(post.service)} variant="outline" size="md">
          {serviceName}
        </ButtonLink>
      </div>
    </>
  );
}
