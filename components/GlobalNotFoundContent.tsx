"use client";

import { useEffect } from "react";
import CookieNotice from "./CookieNotice";
import I18nProviderEn from "./I18nProviderEn";
import I18nProviderRu from "./I18nProviderRu";
import NotFoundContent from "./NotFoundContent";
import { i18nEn } from "@/lib/i18n/en";

// What the 404 page shows. An English address also gets the English tab title,
// once the page has loaded. A 404 is never indexed, so none of this matters for search.
export default function GlobalNotFoundContent() {
  useEffect(() => {
    if (document.documentElement.dataset.lang !== "en") return;
    const title = i18nEn.t("notFound.metaTitle");
    const apply = () => {
      if (document.title !== title) document.title = title;
    };
    apply();
    // The page's own metadata writes the Russian title again while it hydrates, a moment
    // after this effect has run, so the English one is put back whenever that happens.
    const watch = new MutationObserver(apply);
    watch.observe(document.head, { childList: true, characterData: true, subtree: true });
    return () => watch.disconnect();
  }, []);

  return (
    <>
      <div className="not-found-ru">
        <I18nProviderRu>
          <NotFoundContent />
          <CookieNotice />
        </I18nProviderRu>
      </div>
      <div className="not-found-en">
        <I18nProviderEn>
          <NotFoundContent />
          <CookieNotice />
        </I18nProviderEn>
      </div>
    </>
  );
}
