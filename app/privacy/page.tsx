import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import JsonLd from "@/components/JsonLd";
import { graph, webPageNode } from "@/lib/schema";
import {
  POLICY_UPDATED,
  cleanPolicyHtml,
  formatPolicyDate,
  hasPolicyText,
  readPrivacyHtml,
  splitPolicy,
} from "@/lib/privacy";

const raw = readPrivacyHtml();
const ready = hasPolicyText(raw);
const { intro, sections } = splitPolicy(cleanPolicyHtml(raw));

export const metadata: Metadata = {
  title: "Политика конфиденциальности - KEL Studio",
  alternates: { canonical: "/privacy" },
  // While content/privacy.html is empty the page stays out of the search index;
  // with text in it the page opens for indexing by itself.
  ...(ready ? {} : { robots: { index: false, follow: true } }),
};

const structuredData = graph([
  webPageNode({
    path: "/privacy",
    name: "Политика конфиденциальности - KEL Studio",
    description: "Политика в отношении обработки персональных данных",
    modified: POLICY_UPDATED,
  }),
]);

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <SmoothScroll>
        <JsonLd data={structuredData} />
        <div className="flex min-h-screen flex-col bg-page">
          <main className="flex-1">
            {/* The look of headings, paragraphs, lists and links comes from the
                `legal` class (globals.css). The text itself is content/privacy.html:
                each h2 becomes a section with an id. The width is the site's container. */}
            <article className="legal mx-auto w-full max-w-7xl px-6 pb-24 pt-32 md:pt-40">
              <header>
                <h1>Политика конфиденциальности</h1>
                <p className="legal-meta">
                  Политика в отношении обработки персональных данных
                  {ready && (
                    <>
                      {" "}
                      · редакция от <time dateTime={POLICY_UPDATED}>{formatPolicyDate(POLICY_UPDATED)}</time>
                    </>
                  )}
                </p>
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
