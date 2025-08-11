import Link from "next/link";
import { Suspense } from "react";
import LatestPublicPosts from "@/components/blog/LatestPublicPosts";
import Logo from "@/components/common/Logo";

export default function Home() {
  return (
    <>
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-4">
              <Logo className="h-16 w-auto" />
            </div>
            <div className="relative mt-8 max-w-2xl mx-auto">
              <div className="text-center px-6 py-8 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-emerald-500">
                    AI × 好奇心
                  </span>
                  <span className="block text-xl font-normal text-gray-600 dark:text-gray-300 mt-2">
                    で、まだ見ぬ可能性を形にする。
                  </span>
                </h2>
                <div className="relative inline-block mt-6">
                  <p className="text-lg text-gray-700 dark:text-gray-300 relative z-10 px-4 py-2">
                    <span className="text-sky-600 dark:text-sky-400 font-medium">LogicEdge</span> は、
                    <span className="relative">
                      <span className="relative z-10">趣味発の探究心で</span>
                      <span className="absolute bottom-0 left-0 w-full h-2 bg-amber-100 dark:bg-amber-900/30 -z-0 opacity-60"></span>
                    </span>
                    生成AIを試し続ける実験場です。
                  </p>
                  <div className="absolute -bottom-1 left-1/2 w-4/5 h-0.5 bg-gradient-to-r from-sky-400/0 via-sky-400 to-sky-400/0 transform -translate-x-1/2"></div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                href="/blog"
                className="px-5 py-3 rounded-md bg-primary-600 text-white hover:bg-primary-700"
              >
                ブログを見る
              </Link>
              <Link
                href="/about"
                className="px-5 py-3 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                ポートフォリオ
              </Link>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary-50/70 to-transparent dark:from-primary-950/30" />
      </section>
      
      {/* 最新記事セクション */}
      <section className="py-12 bg-gray-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-bold mb-8">最新の記事</h2>
          <Suspense fallback={<div className="text-center py-10">読み込み中...</div>}>
            <LatestPublicPosts />
          </Suspense>
          <div className="mt-10 text-center">
            <Link 
              href="/blog" 
              className="inline-flex items-center px-5 py-2.5 rounded-md border border-primary-500 text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950/50"
            >
              すべての記事を見る
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
