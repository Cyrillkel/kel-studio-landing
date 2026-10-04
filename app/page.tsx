import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import AboutPremium from "@/components/AboutPremium";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import JsonLd from "@/components/JsonLd";
import ru from "@/locales/ru.json";
import { faqNode, graph, webPageNode } from "@/lib/schema";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";

// The questions in the FAQ section of the home page, as the page shows them.
const structuredData = graph(
  [
    webPageNode({ path: "/", name: SITE_TITLE, description: SITE_DESCRIPTION }),
    faqNode(
      "/",
      ru.faq.items.map((item) => ({ q: item.question, a: item.answer }))
    ),
  ],
  { catalog: true }
);

export default function Home() {
  return (
    <>
      {/* Outside the smooth scroller: it moves its content with a transform, which would carry a fixed header away. */}
      <Navigation />
      <SmoothScroll>
        <JsonLd data={structuredData} />
        <main className="bg-[#0a0a0a]">
          <Hero />
          <Services />
          <Pricing />
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
