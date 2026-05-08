"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="테마 전환"
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-400 transition-colors hover:text-ink-900"
    >
      <Moon aria-hidden="true" size={15} className="dark:hidden" />
      <Sun aria-hidden="true" size={15} className="hidden dark:block" />
    </button>
  );
}
