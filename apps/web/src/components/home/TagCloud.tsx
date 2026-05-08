import Link from "next/link";
import type { Bucket } from "@/lib/content/posts";
import { Reveal } from "@/components/ui/Reveal";

type Props = { tags: Bucket[] };

export function TagCloud({ tags }: Props) {
  if (tags.length === 0) return null;
  const visible = tags.slice(0, 12);

  return (
    <section>
      <Reveal>
        <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400">
          태그
        </p>
      </Reveal>
      <Reveal stagger={25} className="flex flex-wrap gap-2">
        {visible.map((tag) => (
          <Link
            key={tag.slug}
            href={`/tags/${tag.slug}`}
            className="rounded border border-line bg-bg-surface px-2.5 py-1 font-mono text-[11px] text-ink-400 transition-colors hover:border-ink-400 hover:text-ink-700"
          >
            #{tag.label}
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
