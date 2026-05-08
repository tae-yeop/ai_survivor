"use client";

import { cn } from "@/lib/utils";

type Pill = { slug: string; label: string };

type Props = {
  pills: Pill[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
};

export function CategoryFilterPills({ pills, selected, onSelect }: Props) {
  const btnBase =
    "flex-shrink-0 rounded-full border px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.04em] transition-colors";
  const btnOn = "border-ink-900 bg-ink-900 text-bg-surface";
  const btnOff =
    "border-line bg-bg-surface text-ink-400 hover:border-ink-400 hover:text-ink-700";

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(btnBase, selected === null ? btnOn : btnOff)}
      >
        전체
      </button>
      {pills.map((pill) => (
        <button
          key={pill.slug}
          type="button"
          onClick={() => onSelect(pill.slug)}
          className={cn(btnBase, selected === pill.slug ? btnOn : btnOff)}
        >
          {pill.label}
        </button>
      ))}
    </div>
  );
}
