import { cn } from "@/lib/utils";

export function PageHeader({
  kicker,
  title,
  description,
  className,
}: {
  kicker: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <section className={cn("container-hero pt-16 sm:pt-20", className)}>
      <p className="kicker kicker-accent">{kicker}</p>
      <h1 className="mt-4 max-w-4xl font-display text-mast text-ink-900 text-balance">{title}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-500 text-pretty">
        {description}
      </p>
    </section>
  );
}
