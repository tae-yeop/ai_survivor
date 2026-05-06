export function getSearchParam(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  key: string,
) {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] : value;
}

export function AdminHeader({
  title,
  description,
  eyebrow = "Admin",
}: {
  title: string;
  description: string;
  eyebrow?: string;
}) {
  return (
    <header className="mb-8 border-b border-paper-rule pb-6">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">{eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink-900">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-500">{description}</p>
    </header>
  );
}

export function ConfigWarning({ title, missing }: { title: string; missing: string[] }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed">
        Add these server-only environment variables in Vercel and local .env files:
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5 font-mono text-xs">
        {missing.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
