export type DocumentEmbedKind = "pdf" | "document";

export type DocumentEmbedProps = {
  src: string;
  title?: string;
  kind?: DocumentEmbedKind;
};

export function DocumentEmbed({ src, title, kind = "document" }: DocumentEmbedProps) {
  if (!src) return null;
  const label = title?.trim() || "Document";

  if (kind === "pdf") {
    return (
      <figure className="my-8 overflow-hidden rounded-lg border border-paper-rule bg-paper-deep">
        <figcaption className="border-b border-paper-rule px-4 py-3 text-sm font-semibold text-ink-800">
          {label}
        </figcaption>
        <iframe src={src} title={label} className="h-[70vh] w-full bg-paper" loading="lazy" />
        <div className="border-t border-paper-rule px-4 py-3">
          <a
            href={src}
            className="text-sm font-medium text-accent underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Open PDF in a new tab
          </a>
        </div>
      </figure>
    );
  }

  return (
    <aside className="my-8 rounded-lg border border-paper-rule bg-paper-deep p-4">
      <p className="text-sm font-semibold text-ink-800">{label}</p>
      <p className="mt-1 text-sm text-ink-500">
        This document is available to download or open in a new tab.
      </p>
      <a
        href={src}
        className="mt-3 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
        target="_blank"
        rel="noreferrer"
      >
        Open document
      </a>
    </aside>
  );
}
