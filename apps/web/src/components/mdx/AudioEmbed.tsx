export type AudioEmbedProps = {
  src: string;
  title?: string;
};

export function AudioEmbed({ src, title }: AudioEmbedProps) {
  if (!src) return null;
  const label = title?.trim() || "Audio";

  return (
    <figure className="my-8 rounded-lg border border-paper-rule bg-paper-deep p-4">
      <figcaption className="mb-3 text-sm font-semibold text-ink-800">{label}</figcaption>
      <audio controls preload="metadata" src={src} className="w-full">
        <a href={src}>Download audio</a>
      </audio>
      <a
        href={src}
        className="mt-3 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
        download
      >
        Download audio
      </a>
    </figure>
  );
}
