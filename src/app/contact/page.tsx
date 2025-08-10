import Link from "next/link";

export const metadata = {
  title: "仕事のご相談 | LogicEdge",
  description: "LogicEdge — 小さな一歩から切り拓く、AIとWebの可能性。制作・開発・AI活用のご相談はこちらから。",
};

export default function ContactPage() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "you@example.com";
  const subject = encodeURIComponent("【LogicEdge】開発/AI活用のご相談");
  const body = encodeURIComponent(
    "ご相談内容：\n- 背景：\n- 目的：\n- 期日：\n- 予算感：\n\nご連絡先：\n"
  );
  const mailto = `mailto:${email}?subject=${subject}&body=${body}`;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
        仕事のご相談
      </h1>
      <p className="mt-3 text-slate-700 dark:text-slate-200">
        制作・開発・AI導入のご相談を承っています。要件の明確化から設計・実装・運用まで、目的達成に必要な最短ルートをご提案します。
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
          <h2 className="font-semibold">対応領域</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
            <li>Webアプリ開発（Next.js / Firebase）</li>
            <li>AI統合（Gemini / OpenAI）</li>
            <li>AI記事生成・運用の内製化</li>
            <li>ブログ構築 / SEO / OG最適化</li>
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
          <h2 className="font-semibold">進め方</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
            <li>ヒアリング（現状・目的・制約の確認）</li>
            <li>提案・見積（スコープ/スケジュール/体制）</li>
            <li>スプリント実装（週次レビュー・成果物納品）</li>
          </ol>
        </div>
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <a
          href={mailto}
          className="inline-flex rounded-md bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:ring-offset-slate-950"
        >
          メールで相談する
        </a>
        <Link
          href="/blog"
          className="inline-flex rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          公開記事を見る
        </Link>
      </div>

      <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
        メールが起動しない場合は、NEXT_PUBLIC_CONTACT_EMAIL を .env.local に設定してください。
      </p>
    </main>
  );
}
