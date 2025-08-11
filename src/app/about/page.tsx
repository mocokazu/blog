import Link from "next/link";
import Logo from "@/components/common/Logo";

export const metadata = {
  title: "About | LogicEdge",
  description:
    "LogicEdge の自己紹介。ノーコードやバイブコーディングでアイデアをすばやく形に。まずやってみて、改善していくスタイルです。",
};

export default function AboutPage() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
  const subject = encodeURIComponent("【お問い合わせ】開発/AI導入のご相談");
  const mailto = email ? `mailto:${email}?subject=${subject}` : undefined;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <header className="relative overflow-hidden">
        <div className="mx-auto text-center">
          <div className="inline-flex items-center justify-center">
            <Logo className="h-12 w-auto md:h-14" />
          </div>
          <h1 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-emerald-500">AI × 好奇心</span>
            <span className="block mt-2 text-xl md:text-2xl font-normal text-slate-600 dark:text-slate-300">で、まだ見ぬ可能性を形にする。</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-700 dark:text-slate-300">
            <span className="text-sky-600 dark:text-sky-400 font-medium">LogicEdge</span>は、趣味発の探究心で生成AIを試し続ける実験場です。
          </p>
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-sky-50/60 to-transparent dark:from-sky-950/20" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-300/10 blur-3xl" />
      </header>

      <hr className="my-6 border-slate-200 dark:border-slate-800" />

      <section className="space-y-5">
        <h2 className="text-xl font-semibold">自己紹介</h2>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 p-6 shadow-sm">
          <p className="text-slate-700 dark:text-slate-200">
            はじめまして。LogicEdge の管理人、kazu（千）です。ノーコードとバイブコーディングを軸に、思いついたアイデアを短いサイクルで検証し、素早くカタチにします。
          </p>
          <p className="mt-2 text-slate-700 dark:text-slate-200">
            好奇心を原動力に、生成AIツールを使って「まずやってみる → 改善する」のループを回し続けています。
          </p>

          <div className="mt-5">
            <h3 className="font-semibold">できること</h3>
            <ul className="mt-2 space-y-2 text-slate-700 dark:text-slate-200">
              <li className="flex items-center">
                <svg className="mr-2 h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                このWebサイト制作（ノーコード / バイブコーディング）
              </li>
              <li className="flex items-center">
                <svg className="mr-2 h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                ここのブログ記事はAIを活用した自動記事作成です。1字も私は書いてません。
              </li>
              <li className="flex items-center">
                <svg className="mr-2 h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                小規模な自動化ツールや作業効率化の仕組みづくり
              </li>
            </ul>
          </div>
        </div>
      </section>

      <hr className="my-8 border-slate-200 dark:border-slate-800" />

      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent inline-block">
            私らしさ
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Play / Ship / Learn を合言葉に、まず動かしてから磨きます。
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-2 inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Play First</div>
            <p className="text-sm text-slate-700 dark:text-slate-300">小さく試して、学びを最速で得る。アイデアは手を動かして確かめます。</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-2 inline-flex items-center rounded-md bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-900/40 dark:text-sky-300">Ship Fast</div>
            <p className="text-sm text-slate-700 dark:text-slate-300">MVPで素早く届ける。価値検証を回しながら改善します。</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-2 inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Learn Always</div>
            <p className="text-sm text-slate-700 dark:text-slate-300">継続的に学び、積み重ねる。知見はブログに残します。</p>
          </div>
        </div>
        <div className="pt-2">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Toolkit</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">Next.js</span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">Tailwind CSS</span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">Firebase</span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">Gemini API</span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">No-code / Make</span>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent inline-block">
            Our Services
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            AIを駆使した次世代のソリューションを提供します
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* AI導入支援 */}
          <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-sky-100 opacity-20 transition-all duration-300 group-hover:scale-110 dark:bg-sky-900/30"></div>
            <div className="relative z-10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d="M12 8V4H8"></path>
                  <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                  <path d="M2 14h2"></path>
                  <path d="M20 14h2"></path>
                  <path d="M15 13v2"></path>
                  <path d="M9 13v2"></path>
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                AI導入支援
                <span className="ml-2 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-900/50 dark:text-sky-300">メイン</span>
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  業務プロセスのAI自動化
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  ChatGPTなど生成AIの業務組み込み
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  データ分析・レポーティング基盤の構築
                </li>
              </ul>
            </div>
          </div>

          {/* システム開発 */}
          <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-purple-100 opacity-20 transition-all duration-300 group-hover:scale-110 dark:bg-purple-900/30"></div>
            <div className="relative z-10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                  <path d="M3 9h18"></path>
                  <path d="M9 21V9"></path>
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                システム開発
                <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">支援レベル</span>
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Webアプリケーション開発
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  API設計・外部サービス連携
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  セキュリティ・スケーラビリティ
                </li>
              </ul>
            </div>
          </div>

          {/* WEB製作 */}
          <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-100 opacity-20 transition-all duration-300 group-hover:scale-110 dark:bg-amber-900/30"></div>
            <div className="relative z-10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"></path>
                  <path d="m12 12 4 4 6-6"></path>
                  <path d="m16 5 3 3"></path>
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                WEB製作
                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">支援レベル</span>
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  コーポレートサイト・LP・ECサイト
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  UI/UXデザイン最適化
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  パフォーマンス・SEO対策
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <hr className="my-8 border-slate-200 dark:border-slate-800" />

      <section className="space-y-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-sky-500 bg-clip-text text-transparent">ポートフォリオ</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sky-100 opacity-20 group-hover:scale-110 transition-all dark:bg-sky-900/30"></div>
            <div className="relative z-10">
              <div className="mb-2 inline-flex items-center rounded-md bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-900/50 dark:text-sky-300">MVP</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI記事自動生成</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                <li>Geminiでドラフト生成→投稿まで</li>
                <li>ダッシュボードで下書き管理</li>
                <li>公開フローを最適化</li>
              </ul>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-100 opacity-20 group-hover:scale-110 transition-all dark:bg-emerald-900/30"></div>
            <div className="relative z-10">
              <div className="mb-2 inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">Automation</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">小さな自動化</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                <li>Make/Zapier/Functionsで効率化</li>
                <li>スプレッドシート・API連携</li>
                <li>運用コストをミニマム化</li>
              </ul>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-100 opacity-20 group-hover:scale-110 transition-all dark:bg-amber-900/30"></div>
            <div className="relative z-10">
              <div className="mb-2 inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">Design</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">UIテーマ & ブランディング</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                <li>Logo / ダークモード / タイポ</li>
                <li>カードUIとアクセントカラー</li>
                <li>読みやすさ重視のレイアウト</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <hr className="my-8 border-slate-200 dark:border-slate-800" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How to Work Together</h2>
        <ul className="list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-200">
          <li>
            <strong>契約形態</strong>: 業務委託 / プロジェクト単位 / 顧問契約
          </li>
          <li>
            <strong>対応方法</strong>: オンラインMTG、チャット、ドキュメント共有
          </li>
          <li>
            <strong>連絡先</strong>: <Link href="/contact" className="text-sky-700 hover:underline dark:text-sky-400">お問い合わせフォーム</Link>
            {mailto && (
              <>
                {" "}または <a href={mailto} className="text-sky-700 hover:underline dark:text-sky-400">Email</a>
              </>
            )}
          </li>
        </ul>
      </section>

      <hr className="my-8 border-slate-200 dark:border-slate-800" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">モットー</h2>
        <blockquote className="border-l-4 border-slate-300 pl-4 text-slate-700 dark:border-slate-700 dark:text-slate-200">
          完璧じゃなくても、まず試す。そして改善する。
        </blockquote>
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/contact"
          className="inline-flex rounded-md bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:ring-offset-slate-950"
        >
          仕事の相談をする
        </Link>
        {mailto && (
          <a
            href={mailto}
            className="inline-flex rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            メールで相談する
          </a>
        )}
      </div>
    </main>
  );
}
