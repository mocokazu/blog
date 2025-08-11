"use client";

import Link from "next/link";
import ThemeToggle from "../theme/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/common/Logo";

export default function SiteHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-950/80 dark:supports-[backdrop-filter]:bg-slate-950/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center" aria-label="LogicEdge Home">
            <Logo className="h-6 w-auto" fallbackText="LogicEdge" />
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
            <Link href="/blog" className="font-medium hover:text-slate-900 dark:hover:text-slate-50">ブログ</Link>
            <Link href="/about" className="hover:text-slate-900 dark:hover:text-slate-50">ポートフォリオ</Link>
            {user && (
              <>
                {/* 管理者メニュー */}
                <div className="relative group">
                  <button className="flex items-center gap-1 text-sm hover:text-slate-900 dark:hover:text-slate-50">
                    管理者メニュー
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:rotate-180">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-white dark:bg-slate-900 rounded-md shadow-lg border border-slate-200 dark:border-slate-800 py-1 w-40 z-50">
                    <Link href="/dashboard" className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">ダッシュボード</Link>
                    <Link href="/dashboard/ai-writer" className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">AIライター</Link>
                  </div>
                </div>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden sm:inline-flex rounded-md bg-sky-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:ring-offset-slate-950"
          >
            仕事の相談
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
