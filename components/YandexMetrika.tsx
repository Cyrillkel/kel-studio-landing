"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { GOALS, reachGoal, type Ym } from "@/lib/metrika";
import { SITE_URL, YANDEX_METRIKA_ID } from "@/lib/site";

const TAG_URL = `https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}`;
const SITE_HOST = new URL(SITE_URL).hostname;

// Counts only the real site, so local builds and previews don't skew the stats.
const isLiveHost = () =>
  location.hostname === SITE_HOST || location.hostname.endsWith(`.${SITE_HOST}`);

// Where on the page a click happened: the section id, or the page path when
// the section has none (service pages).
function placeOf(link: Element) {
  const section = link.closest("section[id]")?.id;
  if (section) return section;
  if (link.closest(".hero-content")) return "hero";
  if (link.closest("#mobile-menu")) return "menu";
  if (link.closest("footer")) return "footer";
  if (link.closest("header, nav")) return "nav";
  return location.pathname;
}

// Yandex Metrika: page views, click map, session replay, and the goals from
// lib/metrika.ts. The counter script is the heaviest third-party script on the
// site, so it is fetched after the page has loaded, in an idle moment; calls
// made before it arrives are queued by the stub and replayed.
export default function YandexMetrika() {
  const pathname = usePathname();
  const lastUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!isLiveHost()) return;

    if (!window.ym) {
      // The same stub the standard Metrika snippet defines.
      const ym: Ym = function () {
        // eslint-disable-next-line prefer-rest-params
        (ym.a = ym.a || []).push(arguments);
      };
      window.ym = ym;
      window.dataLayer = window.dataLayer || [];
      ym.l = Date.now();
      ym(YANDEX_METRIKA_ID, "init", {
        ssr: true,
        webvisor: true,
        clickmap: true,
        ecommerce: "dataLayer",
        referrer: document.referrer,
        url: location.href,
        accurateTrackBounce: true,
        trackLinks: true,
      });
    }

    const load = () => {
      if (Array.from(document.scripts).some((script) => script.src === TAG_URL)) return;
      const script = document.createElement("script");
      script.async = true;
      script.src = TAG_URL;
      document.head.appendChild(script);
    };
    // Safari has no requestIdleCallback.
    const hasIdle = typeof window.requestIdleCallback === "function";
    let idle = 0;
    const schedule = () => {
      idle = hasIdle
        ? window.requestIdleCallback(load, { timeout: 3000 })
        : window.setTimeout(load, 1000);
    };
    const onLoad = () => schedule();
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", onLoad, { once: true });

    // One listener for every button, so the components stay untouched: links
    // to #contact are "contact us" buttons, t.me is Telegram, wa.me is
    // WhatsApp, tel: is the phone number.
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const place = () => placeOf(link);
      if (href.endsWith("#contact")) {
        reachGoal(GOALS.ctaContact, { place: place() });
      } else if (href.startsWith("https://t.me/")) {
        reachGoal(GOALS.telegramClick, { place: place() });
      } else if (href.startsWith("https://wa.me/")) {
        reachGoal(GOALS.whatsappClick, { place: place() });
      } else if (href.startsWith("tel:")) {
        reachGoal(GOALS.phoneClick, { place: place() });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("load", onLoad);
      document.removeEventListener("click", onClick);
      if (idle) {
        if (hasIdle) window.cancelIdleCallback(idle);
        else window.clearTimeout(idle);
      }
    };
  }, []);

  // The site changes pages without reloading (next/link), which the counter
  // can't see on its own: report each new page. The first page was already
  // reported by `init`.
  useEffect(() => {
    const url = location.href;
    if (lastUrl.current !== null && lastUrl.current !== url) {
      window.ym?.(YANDEX_METRIKA_ID, "hit", url, {
        title: document.title,
        referer: lastUrl.current,
      });
    }
    lastUrl.current = url;
  }, [pathname]);

  return null;
}
