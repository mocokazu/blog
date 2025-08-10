import Link from 'next/link'
import { ArrowRight, Sparkles, User, BookOpen, Palette } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Live2D/VRMキャラクター搭載
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="text-gradient">創造と技術の</span>
              <br />
              <span className="text-gray-900">ポートフォリオ</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Live2Dキャラクターと3D空間を活用した、
              <br />
              次世代の個人ブログ・ポートフォリオサイトへようこそ
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog" className="btn-primary inline-flex items-center">
                ブログを読む
                <BookOpen className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/portfolio" className="btn-outline inline-flex items-center">
                ポートフォリオを見る
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">特徴的な機能</h2>
            <p className="text-xl text-gray-600">革新的な技術で表現する新しい体験</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center group hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                <User className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Live2Dキャラクター</h3>
              <p className="text-gray-600">
                インタラクティブなLive2Dキャラクターが
                サイト体験をガイドします
              </p>
            </div>
            
            <div className="card text-center group hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary-200 transition-colors">
                <Palette className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">3Dポートフォリオ空間</h3>
              <p className="text-gray-600">
                美術館のような3D空間で
                作品を立体的に展示
              </p>
            </div>
            
            <div className="card text-center group hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-200 transition-colors">
                <BookOpen className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">プレミアムコンテンツ</h3>
              <p className="text-gray-600">
                サブスクリプション限定の
                特別なコンテンツを提供
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            一緒に新しい体験を始めませんか？
          </h2>
          <p className="text-xl mb-8 opacity-90">
            最新の技術と創造性を組み合わせた、
            これまでにないポートフォリオサイトをお楽しみください
          </p>
          <Link href="/about" className="btn bg-white text-primary-600 hover:bg-gray-100 inline-flex items-center">
            詳しく見る
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
