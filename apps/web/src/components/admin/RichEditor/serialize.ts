// Tiptap's renderHTML always produces double-quoted attributes, so src/alt captures use double quotes.
// data-* attributes from NodeView may use single quotes in test fixtures, so attr() handles both.
const FIGURE_RE =
  /<figure[^>]*data-figure="true"([^>]*)>[\s\S]*?<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>[\s\S]*?<\/figure>/g;

function attr(raw: string, name: string): string {
  const dq = new RegExp(`data-${name}="([^"]*)"`).exec(raw);
  if (dq) return dq[1];
  const sq = new RegExp(`data-${name}='([^']*)'`).exec(raw);
  return sq?.[1] ?? "";
}

export function htmlFigureToMdx(markdown: string): string {
  return markdown.replace(
    FIGURE_RE,
    (_match, attrsRaw: string, src: string, alt: string) => {
      const width = attr(attrsRaw, "width") || "100%";
      const align = attr(attrsRaw, "align") || "center";
      const caption = attr(attrsRaw, "caption");
      const widthAttr = width === "100%" ? "" : ` width="${width}"`;
      const alignAttr = align === "center" ? "" : ` align="${align}"`;
      const captionAttr = caption
        ? ` caption="${caption.replace(/"/g, "&quot;")}"`
        : "";
      return `<Figure src="${src}" alt="${alt}"${widthAttr}${alignAttr}${captionAttr} />`;
    },
  );
}
