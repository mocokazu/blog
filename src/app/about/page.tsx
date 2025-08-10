import Link from "next/link";

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
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
          LogicEdge
        </h1>
      </header>

      <hr className="my-6 border-slate-200 dark:border-slate-800" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">自己紹介</h2>
        <p className="text-slate-700 dark:text-slate-200">はじめまして。LogicEdge の管理人です。</p>
        <p className="text-slate-700 dark:text-slate-200">趣味の延長からスタートし、AIとWeb制作を独学で学び続けています。</p>
        <p className="text-slate-700 dark:text-slate-200">コードはほとんど書かず、ノーコードやバイブコーディングでアイデアをすばやく形にするのがスタイルです。</p>

        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">できること</h3>
          <ul className="list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-200">
            <li>簡易的なWebサイト制作（ノーコード / バイブコーディング）</li>
            <li>AIを活用した記事作成・コンテンツ生成</li>
            <li>小規模な自動化ツールや作業効率化の仕組みづくり</li>
          </ul>
        </div>
      </section>

      <hr className="my-8 border-slate-200 dark:border-slate-800" />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Services</h2>

        <div>
          <h3 className="font-semibold">Web制作・開発</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-200">
            <li>コーポレートサイト、LP、ECサイトの構築</li>
            <li>レスポンシブデザイン・UI/UX最適化</li>
            <li>パフォーマンスチューニング・SEO対策</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">AI導入支援</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-200">
            <li>業務プロセスのAI自動化</li>
            <li>ChatGPTなど生成AIの業務組み込み</li>
            <li>データ分析・レポーティング基盤の構築</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">システム開発</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-200">
            <li>Webアプリケーション開発（フロント・バックエンド）</li>
            <li>API設計・外部サービス連携</li>
            <li>セキュリティ・スケーラビリティ考慮</li>
          </ul>
        </div>
      </section>

      <hr className="my-8 border-slate-200 dark:border-slate-800" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Selected Projects</h2>
        <article className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
          <h3 className="font-semibold">AI駆動型ブログ・ポートフォリオサイト</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-200">
            <li>
              <strong>内容</strong>: 個人の活動・知見発信と案件獲得を両立するサイトをAIで運営
            </li>
            <li>
              <strong>成果</strong>: コンテンツ生成の自動化により、更新コストを大幅削減
            </li>
          </ul>
        </article>
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
