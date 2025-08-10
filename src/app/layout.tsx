import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import '@/styles/globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/components/providers/AuthProvider'
import CharacterAssistant from '@/components/character/CharacterAssistant'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
})

export const metadata: Metadata = {
  title: '個人ブログ・ポートフォリオサイト',
  description: 'Live2D/VRMキャラクターを活用した個人ブログ・ポートフォリオサイト',
  keywords: ['ブログ', 'ポートフォリオ', 'Live2D', 'VRM', 'Next.js'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: '個人ブログ・ポートフォリオサイト',
    description: 'Live2D/VRMキャラクターを活用した個人ブログ・ポートフォリオサイト',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <AuthProvider>
          <div id="root">
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <CharacterAssistant />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
