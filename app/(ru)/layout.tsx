import CookieNotice from "@/components/CookieNotice";
import I18nProviderRu from "@/components/I18nProviderRu";
import RootShell from "@/components/RootShell";
import { fontClasses } from "@/lib/fonts.ru";
import { rootMetadata } from "@/lib/pageMetadata";

// Root layout of the Russian pages, which live at the root of the site. The
// English ones have their own in app/(en)/layout.tsx: the two share everything
// but the language (components/RootShell.tsx).
export const metadata = rootMetadata("ru");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootShell lang="ru" fontClasses={fontClasses}>
      <I18nProviderRu>
        {children}
        <CookieNotice />
      </I18nProviderRu>
    </RootShell>
  );
}
