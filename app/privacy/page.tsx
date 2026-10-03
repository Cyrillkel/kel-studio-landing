import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { hasPolicyText, readPrivacyHtml } from "@/lib/privacy";

const policyHtml = readPrivacyHtml();
const ready = hasPolicyText(policyHtml);

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
      <main className="flex min-h-screen flex-col bg-[#0a0a0a]">
        <Navigation />
        {/* The look of headings, paragraphs, lists and links comes from the
            `legal` class (globals.css). The text itself is content/privacy.html. */}
        <article className="legal mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-32 sm:px-6 md:pt-40">
          <h1>Политика конфиденциальности</h1>
          <div dangerouslySetInnerHTML={{ __html: policyHtml }} />
        </article>
        <Footer />
      </main>
    </SmoothScroll>
  );
}
