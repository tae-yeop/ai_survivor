"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type State = "loading" | "anon" | "admin";

export function AdminQuickActions() {
  const pathname = usePathname();
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/me", { cache: "no-store", credentials: "same-origin" })
      .then(async (response) => {
        if (cancelled) return;
        if (!response.ok) {
          setState("anon");
          return;
        }
        const data = (await response.json()) as { admin?: boolean };
        setState(data.admin ? "admin" : "anon");
      })
      .catch(() => {
        if (!cancelled) setState("anon");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state !== "admin" || pathname === "/write") return null;

  return (
    <Link
      href="/write"
      className="fixed bottom-6 left-6 z-30 rounded-full border border-accent/40 bg-ink-900 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-paper shadow-lg transition hover:bg-accent"
    >
      New post
    </Link>
  );
}
