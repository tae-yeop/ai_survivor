"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  function toggleTheme() {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      className="inline-flex h-9 w-9 items-center justify-center border border-paper-rule bg-bg-secondary text-ink-700 transition-colors hover:border-ink-900 hover:text-accent"
    >
      {isDark ? <Sun aria-hidden="true" size={16} /> : <Moon aria-hidden="true" size={16} />}
    </button>
  );
}
