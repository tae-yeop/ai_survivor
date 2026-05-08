"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type State = "loading" | "anon" | { login: string };

export function AdminStatusBadge() {
  const [state, setState] = useState<State>("loading");
  const pathname = usePathname();
  const isPostPage = /^\/posts\/[^/]+\/?$/.test(pathname);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/me", { cache: "no-store", credentials: "same-origin" })
      .then(async (response) => {
        if (cancelled) return;
        if (response.ok) {
          const data = (await response.json()) as { admin?: boolean; login?: string };
          if (data.admin && data.login) {
            setState({ login: data.login });
            return;
          }
        }
        setState("anon");
      })
      .catch(() => {
        if (!cancelled) setState("anon");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return (
      <span
        aria-hidden="true"
        className="inline-block h-3 w-12 animate-pulse rounded bg-paper-rule/60"
      />
    );
  }

  if (state === "anon") {
    return (
      <Link
        href="/admin/login"
        className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-400 hover:text-accent"
      >
        Sign in
      </Link>
    );
  }

  return (
    <span className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.12em]">
      {isPostPage && (
        <>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("start-post-edit"))}
            className="text-ink-500 hover:text-accent"
          >
            편집
          </button>
          <span aria-hidden="true" className="text-ink-300">
            ·
          </span>
        </>
      )}
      <Link href="/write" className="text-accent hover:text-ink-800">
        Write
      </Link>
      <span aria-hidden="true" className="text-ink-300">
        ·
      </span>
      <Link href="/admin" className="flex items-center gap-1.5 text-ink-600 hover:text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
        <span>{state.login}</span>
      </Link>
      <span aria-hidden="true" className="text-ink-300">
        ·
      </span>
      <a href="/api/admin/logout" className="text-ink-400 hover:text-accent">
        Sign out
      </a>
    </span>
  );
}
