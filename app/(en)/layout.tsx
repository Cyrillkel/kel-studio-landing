import CookieNotice from "@/components/CookieNotice";
import I18nProviderEn from "@/components/I18nProviderEn";
import RootShell from "@/components/RootShell";
import { fontClasses } from "@/lib/fonts.en";
import { rootMetadata } from "@/lib/pageMetadata";

// Root layout of the English pages, all of which live under /en. See
// app/(ru)/layout.tsx for the Russian twin.
export const metadata = rootMetadata("en");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootShell lang="en" fontClasses={fontClasses}>
      <I18nProviderEn>
        {children}
        <CookieNotice />
      </I18nProviderEn>
    </RootShell>
  );
}
