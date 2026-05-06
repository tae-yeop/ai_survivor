"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function EditPostButton({ slug }: { slug: string }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/me", { cache: "no-store", credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.admin) setIsAdmin(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isAdmin) return null;

  return (
    <Link
      href={`/admin/posts/${slug}`}
      className="rounded-md border border-paper-rule bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-700 shadow-sm transition hover:border-accent hover:text-accent"
    >
      Edit
    </Link>
  );
}
