// Tiptap's renderHTML always produces double-quoted attributes, so src/alt captures use double quotes.
// data-* attributes from NodeView may use single quotes in test fixtures, so attr() handles both.
const FIGURE_RE =
  /<figure[^>]*data-figure="true"([^>]*)>[\s\S]*?<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>[\s\S]*?<\/figure>/g;
const MDX_FIGURE_RE = /<Figure\s+([^>]*?)\/>/g;

function attr(raw: string, name: string): string {
  const dq = new RegExp(`data-${name}="([^"]*)"`).exec(raw);
  if (dq) return dq[1];
  const sq = new RegExp(`data-${name}='([^']*)'`).exec(raw);
  return sq?.[1] ?? "";
}

function componentAttr(raw: string, name: string): string {
  const match = new RegExp(`${name}="([^"]*)"`).exec(raw);
  return match?.[1] ?? "";
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function mdxFigureToEditorHtml(markdown: string): string {
  return markdown.replace(MDX_FIGURE_RE, (_match, attrsRaw: string) => {
    const src = componentAttr(attrsRaw, "src");
    const alt = componentAttr(attrsRaw, "alt");
    const width = componentAttr(attrsRaw, "width") || "100%";
    const align = componentAttr(attrsRaw, "align") || "center";
    const caption = componentAttr(attrsRaw, "caption");

    return `<figure data-figure="true" data-width="${escapeHtmlAttr(width)}" data-align="${escapeHtmlAttr(align)}" data-caption="${escapeHtmlAttr(caption)}"><img src="${escapeHtmlAttr(src)}" alt="${escapeHtmlAttr(alt)}" /></figure>`;
  });
}

export function htmlFigureToMdx(markdown: string): string {
  return markdown.replace(FIGURE_RE, (_match, attrsRaw: string, src: string, alt: string) => {
    const width = attr(attrsRaw, "width") || "100%";
    const align = attr(attrsRaw, "align") || "center";
    const caption = attr(attrsRaw, "caption");
    const widthAttr = width === "100%" ? "" : ` width="${width}"`;
    const alignAttr = align === "center" ? "" : ` align="${align}"`;
    const captionAttr = caption ? ` caption="${caption.replace(/"/g, "&quot;")}"` : "";
    return `<Figure src="${src}" alt="${alt}"${widthAttr}${alignAttr}${captionAttr} />`;
  });
}
