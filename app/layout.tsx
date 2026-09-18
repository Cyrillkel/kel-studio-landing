import type { Metadata } from 'next'
import { Inter, Unbounded } from 'next/font/google'
import I18nProvider from '@/components/I18nProvider'
import './globals.css'
import { INDEXABLE } from '@/lib/site'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })
const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-unbounded',
})

export const metadata: Metadata = {
  title: 'KEL Studio - Веб-студия премиум класса',
  description: 'Создаём цифровые продукты будущего. Дизайн, разработка и продвижение сайтов премиум-класса',
  // Hidden from search until the site moves to the real server: see lib/site.ts.
  robots: { index: INDEXABLE, follow: INDEXABLE },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${inter.className} ${unbounded.variable}`}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  )
}
