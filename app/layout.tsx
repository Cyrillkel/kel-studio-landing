import type { Metadata } from 'next'
import { Inter, Unbounded } from 'next/font/google'
import I18nProvider from '@/components/I18nProvider'
import './globals.css'
import {
  CONTACT_EMAIL,
  INDEXABLE,
  SITE_NAME,
  SITE_URL,
  TELEGRAM_URL,
} from '@/lib/site'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })
const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-unbounded',
})

const TITLE = 'KEL Studio - веб-студия полного цикла'
const DESCRIPTION =
  'Создаём цифровые продукты будущего: сайты, интернет-магазины и веб-приложения. Дизайн, разработка, продвижение.'

export const metadata: Metadata = {
  // Lets Next resolve the social image and canonical links to absolute URLs.
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  // Hidden from search until the content is final: see lib/site.ts.
  robots: { index: INDEXABLE, follow: INDEXABLE },
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

// Tells search engines who is behind the site; shown in rich results.
const organization = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  description: DESCRIPTION,
  email: CONTACT_EMAIL,
  sameAs: [TELEGRAM_URL],
  areaServed: 'Worldwide',
  knowsLanguage: ['ru', 'en'],
  serviceType: [
    'Разработка сайтов',
    'Веб-дизайн',
    'Интернет-магазины',
    'SEO-продвижение',
    'Парсинг данных',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${inter.className} ${unbounded.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  )
}
