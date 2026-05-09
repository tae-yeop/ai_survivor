import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DisclosureBoxProps = {
  title?: string;
  children?: ReactNode;
  className?: string;
};

export function DisclosureBox({ title = "Disclosure", children, className }: DisclosureBoxProps) {
  return (
    <aside
      className={cn(
        "rounded-3xl border border-paper-rule bg-paper/90 p-6 shadow-sm md:p-8",
        className,
      )}
      aria-label="수익화 고지"
    >
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">{title}</p>
      <div className="mt-3 max-w-3xl space-y-3 leading-relaxed text-ink-600">
        {children ?? (
          <p>
            이 페이지에는 향후 제휴 링크가 포함될 수 있습니다. 제휴 링크를 통해 구매하면 작성자가
            일정액의 수수료를 받을 수 있으며, 구매자에게 추가 비용은 발생하지 않습니다.
          </p>
        )}
      </div>
    </aside>
  );
}
