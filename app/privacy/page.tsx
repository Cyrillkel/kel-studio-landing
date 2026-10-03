import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
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

export default function PrivacyPage() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
        <Navigation />
        <main className="flex-1">
          {/* The look of headings, paragraphs, lists and links comes from the
              `legal` class (globals.css). The text itself is content/privacy.html:
              each h2 becomes a section with an id, and the contents link to them. */}
          <article className="legal mx-auto w-full max-w-3xl px-5 pb-24 pt-32 sm:px-6 md:pt-40">
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

            {sections.length >= 3 && (
              <nav aria-labelledby="legal-toc-title" className="legal-toc">
                <p id="legal-toc-title" className="legal-toc-title">
                  Содержание
                </p>
                <ol>
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`}>{section.title}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

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
  );
}
