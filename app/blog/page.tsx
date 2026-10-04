import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { BLOG_PATH, CATEGORIES, blogPath, formatDate, getPosts, latestUpdate } from "@/lib/blog";
import { pageMetadata } from "@/lib/pageMetadata";
import { breadcrumbNode, graph, webPageNode } from "@/lib/schema";
import { SITE_URL, TELEGRAM_CHANNEL_URL } from "@/lib/site";

const TITLE = "Блог KEL Studio: сайты, SEO, боты и реклама";
const DESCRIPTION =
  "Практические статьи студии KEL Studio: как выбрать способ создания сайта, подключить Яндекс Вебмастер и Метрику, запустить рекламу и автоматизацию.";

export const metadata: Metadata = {
  ...pageMetadata({ title: TITLE, description: DESCRIPTION, path: BLOG_PATH }),
  alternates: { canonical: BLOG_PATH, types: { "application/rss+xml": `${SITE_URL}${BLOG_PATH}/rss.xml` } },
};

export default function BlogIndex() {
  const posts = getPosts();
  const structuredData = graph([
    webPageNode({
      path: BLOG_PATH,
      name: TITLE,
      description: DESCRIPTION,
      type: "CollectionPage",
      breadcrumb: true,
      modified: latestUpdate(posts) || undefined,
    }),
    breadcrumbNode(BLOG_PATH, [
      { name: "Главная", path: "/" },
      { name: "Блог", path: BLOG_PATH },
    ]),
  ]);

  return (
    <>
      <Navigation />
      <SmoothScroll>
        <JsonLd data={structuredData} />
        <div className="blog-page flex min-h-screen flex-col">
          <main className="flex-1">
            <div className="mx-auto w-full max-w-7xl px-6 pb-24 pt-32 md:pt-40">
              <Breadcrumbs label="Хлебные крошки" items={[{ name: "Главная", href: "/" }, { name: "Блог" }]} />
              <h1 className="blog-heading text-[clamp(1.75rem,6vw,3rem)] font-bold leading-tight">Блог</h1>
              <p className="blog-text mt-4 max-w-2xl text-lg leading-relaxed">
                Пишем о том, с чем сталкиваемся в работе: как сделать и продвинуть сайт, настроить аналитику и рекламу,
                автоматизировать заявки. Коротко и с примерами из своих проектов. Заметки покороче выходят в{" "}
                <a className="blog-link underline underline-offset-4" href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
                  Telegram-канале
                </a>
                .
              </p>

              {posts.length === 0 ? (
                <p className="blog-muted mt-16">Первые статьи скоро появятся.</p>
              ) : (
                <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <li key={post.slug}>
                      <Link href={blogPath(post.slug)} className="blog-card flex h-full flex-col p-6">
                        <span className="blog-chip self-start">{CATEGORIES[post.category]}</span>
                        <h2 className="blog-heading mt-4 text-xl font-bold leading-snug">{post.title}</h2>
                        <p className="blog-text mt-3 flex-1 leading-relaxed">{post.description}</p>
                        <p className="blog-muted mt-5 text-sm">
                          <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.minutes} мин чтения
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
