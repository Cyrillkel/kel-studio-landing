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

export default function Home() {
  return (
    <SmoothScroll>
      <main className="bg-[#0a0a0a]">
        <Navigation />
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
  );
}
