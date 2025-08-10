import Link from "next/link";

export default function Home() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            最小の労力で、最大のインパクトを。
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
            LogicEdge は AI を最大活用するバイブコーディングで、MVP 構築から運用まで一気通貫で支援します。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="px-5 py-3 rounded-md bg-primary-600 text-white hover:bg-primary-700"
            >
              相談してみる
            </Link>
            <Link
              href="/dashboard/ai-writer"
              className="px-5 py-3 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              AIライターを試す
            </Link>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary-50/70 to-transparent dark:from-primary-950/30" />
    </section>
  );
}
