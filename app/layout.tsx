import type { Metadata } from 'next'
import { Inter, Unbounded } from 'next/font/google'
import CookieNotice from '@/components/CookieNotice'
import I18nProvider from '@/components/I18nProvider'
import YandexMetrika from '@/components/YandexMetrika'
import './globals.css'
import {
  INDEXABLE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  VERIFICATION,
  YANDEX_METRIKA_ID,
} from '@/lib/site'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })
// Headings are all bold, so one static weight: the full variable font is about
// 80 kB for these two subsets, the single 700 weight about 33 kB.
const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  weight: '700',
  variable: '--font-unbounded',
})

const TITLE = SITE_TITLE
const DESCRIPTION = SITE_DESCRIPTION

export const metadata: Metadata = {
  // Lets Next resolve the social image and canonical links to absolute URLs.
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  // Hidden from search until the content is final: see lib/site.ts.
  robots: { index: INDEXABLE, follow: INDEXABLE },
  verification: VERIFICATION,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    url: '/',
    locale: 'ru_RU',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${inter.className} ${unbounded.variable}`}>
        <I18nProvider>
          {children}
          <CookieNotice />
        </I18nProvider>
        <YandexMetrika />
        {/* Counts visitors who have JavaScript turned off. */}
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  )
}
