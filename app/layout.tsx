import type { Metadata } from 'next'
import { Inter, Unbounded } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })
const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-unbounded',
})

export const metadata: Metadata = {
  title: 'KEL Studio - Веб-студия премиум класса',
  description: 'Создаём цифровые продукты будущего. Дизайн, разработка и продвижение сайтов премиум-класса',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${inter.className} ${unbounded.variable}`}>
        {children}
      </body>
    </html>
  )
}
