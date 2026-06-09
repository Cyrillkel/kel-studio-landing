import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import ScrollVideoFullscreen from "@/components/ScrollVideoFullscreen";
import AboutPremium from "@/components/AboutPremium";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-[#0a0a0a]">
      <Navigation />
      <Hero />
      <Services />
      <Portfolio />
      <ScrollVideoFullscreen />
      <AboutPremium />
      <Contact />
      <Footer />
    </main>
  );
}
