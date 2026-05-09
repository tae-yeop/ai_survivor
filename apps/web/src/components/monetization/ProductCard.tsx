import type { ReactNode } from "react";
import { monetizationDisclosureLabel, type MonetizedLinkKind } from "@/lib/monetization";
import { cn } from "@/lib/utils";
import { AffiliateLink } from "./AffiliateLink";

type ProductCardProps = {
  title: string;
  description: string;
  href: string;
  ctaLabel?: string;
  kind?: MonetizedLinkKind;
  eyebrow?: string;
  note?: ReactNode;
  className?: string;
};

export function ProductCard({
  title,
  description,
  href,
  ctaLabel = "열기",
  kind = "editorial",
  eyebrow,
  note,
  className,
}: ProductCardProps) {
  return (
    <article
      className={cn(
        "flex min-h-56 flex-col rounded-2xl border border-paper-rule bg-paper/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {eyebrow ? (
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink-400">
              {eyebrow}
            </span>
          ) : null}
          <span className="rounded-full border border-paper-rule px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-500">
            {monetizationDisclosureLabel(kind)}
          </span>
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold text-ink-900">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">{description}</p>
        {note ? <div className="mt-3 text-xs leading-relaxed text-ink-500">{note}</div> : null}
      </div>
      <AffiliateLink
        href={href}
        kind={kind}
        showDisclosureLabel={kind !== "editorial"}
        className="mt-5 font-mono text-xs uppercase tracking-[0.12em] no-underline"
      >
        {ctaLabel} ↗
      </AffiliateLink>
    </article>
  );
}
