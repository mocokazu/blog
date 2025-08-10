"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = resolvedTheme ?? theme;

  const buttonClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-900 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800";

  if (!mounted) {
    return (
      <button aria-label="Toggle theme" className={buttonClass} type="button">
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      aria-label="Toggle theme"
      className={buttonClass}
      type="button"
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      title={current === "dark" ? "ライトに切替" : "ダークに切替"}
    >
      {current === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
