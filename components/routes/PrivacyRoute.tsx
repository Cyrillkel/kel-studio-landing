import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import JsonLd from "@/components/JsonLd";
import { getDictionary } from "@/lib/dictionary";
import { withLang, type Lang } from "@/lib/lang";
import { pageMetadata } from "@/lib/pageMetadata";
import {
  POLICY_UPDATED,
  PRIVACY_PATH,
  cleanPolicyHtml,
  formatPolicyDate,
  hasPolicyText,
  policyReady,
  privacyPaths,
  readPrivacyHtml,
  splitPolicy,
} from "@/lib/privacy";
import { graph, webPageNode } from "@/lib/schema";

export function privacyMetadata(lang: Lang): Metadata {
  const privacy = getDictionary(lang).privacy;
  return {
    // Without its own description the page inherits the home page's one from
    // the language's layout, which search engines report as a duplicate.
    ...pageMetadata({ lang, title: privacy.metaTitle, description: privacy.metaDescription, paths: privacyPaths(lang) }),
    // While the policy file is empty the page stays out of the search index;
    // with text in it the page opens for indexing by itself.
    ...(policyReady(lang) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default function PrivacyRoute({ lang }: { lang: Lang }) {
  const privacy = getDictionary(lang).privacy;
  const raw = readPrivacyHtml(lang);
  const ready = hasPolicyText(raw);
  const { intro, sections } = splitPolicy(cleanPolicyHtml(raw));

  const structuredData = graph(
    [
      webPageNode({
        path: withLang(PRIVACY_PATH, lang),
        name: privacy.metaTitle,
        description: privacy.metaDescription,
        lang,
        modified: POLICY_UPDATED,
      }),
    ],
    { lang }
  );

  return (
    <>
      <Navigation />
      <SmoothScroll>
        <JsonLd data={structuredData} />
        <div className="flex min-h-screen flex-col bg-page">
          <main className="flex-1">
            {/* The look of headings, paragraphs, lists and links comes from the
                `legal` class (globals.css). The text itself is the policy file:
                each h2 becomes a section with an id. The width is the site's container. */}
            <article className="legal mx-auto w-full max-w-7xl px-6 pb-24 pt-32 md:pt-40">
              <header>
                <h1>{privacy.title}</h1>
                <p className="legal-meta">
                  {privacy.subtitle}
                  {ready && (
                    <>
                      {" "}
                      · {privacy.edition}{" "}
                      <time dateTime={POLICY_UPDATED}>{formatPolicyDate(POLICY_UPDATED, lang)}</time>
                    </>
                  )}
                </p>
                {privacy.translationNote && <p className="legal-meta">{privacy.translationNote}</p>}
              </header>

              {intro && <div dangerouslySetInnerHTML={{ __html: intro }} />}

              {sections.map((section) => (
                <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
                  <h2 id={`${section.id}-title`} dangerouslySetInnerHTML={{ __html: section.titleHtml }} />
                  <div dangerouslySetInnerHTML={{ __html: section.html }} />
                </section>
              ))}
            </article>
          </main>
          <Footer />
        </div>
      </SmoothScroll>
    </>
  );
}
