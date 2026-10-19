import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import PulseTeaser from "@/components/PulseTeaser";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import AboutPremium from "@/components/AboutPremium";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import JsonLd from "@/components/JsonLd";
import { getDictionary } from "@/lib/dictionary";
import { withLang, type Lang, type PathPair } from "@/lib/lang";
import { languageAlternates } from "@/lib/pageMetadata";
import { faqNode, graph, webPageNode } from "@/lib/schema";
import { SITE_TEXT } from "@/lib/site";

// The home page of a language. The routes in app/(ru)/page.tsx and
// app/(en)/en/page.tsx only say which one it is.
const paths: PathPair = { ru: "/", en: withLang("/", "en") };

// The title and description come from the language's layout; the page adds its address and its twin.
export const homeMetadata = (lang: Lang): Metadata => ({ alternates: languageAlternates(paths, lang) });

export default function HomeRoute({ lang }: { lang: Lang }) {
  const { title, description } = SITE_TEXT[lang];
  const path = paths[lang];
  // The questions in the FAQ section of the home page, as the page shows them.
  const structuredData = graph(
    [
      webPageNode({ path, name: title, description, lang }),
      faqNode(
        path,
        getDictionary(lang).faq.items.map((item) => ({ q: item.question, a: item.answer }))
      ),
    ],
    { catalog: true, lang }
  );

  return (
    <>
      {/* Outside the smooth scroller: it moves its content with a transform, which would carry a fixed header away. */}
      <Navigation />
      <SmoothScroll>
        <JsonLd data={structuredData} />
        <main className="bg-page">
          <Hero />
          <Services />
          <Pricing />
          <PulseTeaser />
          <Portfolio />
          <Process />
          <AboutPremium />
          <Faq />
          <Contact />
          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
