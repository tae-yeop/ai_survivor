import type { AnchorHTMLAttributes, ReactNode } from "react";
import {
  externalResourceRel,
  monetizationDisclosureLabel,
  type MonetizedLinkKind,
} from "@/lib/monetization";
import { cn } from "@/lib/utils";

type AffiliateLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "rel"> & {
  children: ReactNode;
  kind?: MonetizedLinkKind;
  showDisclosureLabel?: boolean;
};

export function AffiliateLink({
  children,
  className,
  kind = "affiliate",
  showDisclosureLabel = false,
  target = "_blank",
  ...props
}: AffiliateLinkProps) {
  const disclosureLabel = monetizationDisclosureLabel(kind);

  return (
    <a
      className={cn(
        "inline-flex items-center gap-1 font-medium text-accent underline-offset-4 transition hover:text-ink-900 hover:underline",
        className,
      )}
      target={target}
      rel={externalResourceRel(kind)}
      aria-label={
        props["aria-label"] ??
        (kind === "editorial" ? undefined : `${String(children)} (${disclosureLabel})`)
      }
      {...props}
    >
      <span>{children}</span>
      {showDisclosureLabel ? (
        <span className="rounded-full border border-paper-rule px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-500 no-underline">
          {disclosureLabel}
        </span>
      ) : null}
    </a>
  );
}
