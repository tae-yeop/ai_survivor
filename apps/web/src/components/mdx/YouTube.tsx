const YOUTUBE_ID = /^[A-Za-z0-9_-]{6,20}$/;

function extractId(input: string) {
  const trimmed = input.trim();
  if (YOUTUBE_ID.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    const v = url.searchParams.get("v");
    if (v && YOUTUBE_ID.test(v)) return v;
    const segs = url.pathname.split("/").filter(Boolean);
    const last = segs[segs.length - 1] ?? "";
    if (YOUTUBE_ID.test(last)) return last;
  } catch {}
  return null;
}

export function YouTube({ id, title }: { id: string; title?: string }) {
  const safeId = extractId(id);
  if (!safeId) {
    return (
      <div className="my-6 rounded-md border border-paper-rule bg-paper-deep px-4 py-3 text-sm text-ink-500">
        Invalid YouTube id.
      </div>
    );
  }
  return (
    <div className="my-6 aspect-video w-full overflow-hidden rounded-md border border-paper-rule bg-black">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${safeId}`}
        title={title ?? "YouTube video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="h-full w-full"
      />
    </div>
  );
}
