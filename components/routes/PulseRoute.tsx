import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PulsePage from "@/components/pulse/PulsePage";
import { getDictionary } from "@/lib/dictionary";
import { withLang, type Lang, type PathPair } from "@/lib/lang";
import { pageMetadata } from "@/lib/pageMetadata";
import { PULSE_PATH } from "@/lib/pulse";
import { breadcrumbNode, faqNode, graph, webPageNode } from "@/lib/schema";

// The page of the free monitoring bot (/pulse, /en/pulse).
export const pulsePaths: PathPair = { ru: PULSE_PATH, en: withLang(PULSE_PATH, "en") };

export function pulseMetadata(lang: Lang): Metadata {
  const pulse = getDictionary(lang).pulse;
  return pageMetadata({ lang, title: pulse.metaTitle, description: pulse.metaDescription, paths: pulsePaths });
}

export default function PulseRoute({ lang }: { lang: Lang }) {
  const dict = getDictionary(lang);
  const pulse = dict.pulse;
  const path = pulsePaths[lang];
  const structuredData = graph(
    [
      webPageNode({ path, name: pulse.metaTitle, description: pulse.metaDescription, lang, breadcrumb: true }),
      breadcrumbNode(path, [
        { name: dict.servicePages.common.breadcrumbHome, path: withLang("/", lang) },
        { name: pulse.crumb, path },
      ]),
      faqNode(path, pulse.faq),
    ],
    { lang }
  );

  return (
    <>
      <JsonLd data={structuredData} />
      <PulsePage />
    </>
  );
}
