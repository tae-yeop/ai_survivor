// Tiptap's renderHTML always produces double-quoted attributes, so src/alt captures use double quotes.
// data-* attributes from NodeView may use single quotes in test fixtures, so attr() handles both.
const FIGURE_RE =
  /<figure[^>]*data-figure="true"([^>]*)>[\s\S]*?<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>[\s\S]*?<\/figure>/g;
const MDX_FIGURE_RE = /<Figure\s+([^>]*?)\/>/g;
const AUDIO_EMBED_RE = /<div[^>]*data-audio-embed=(?:"true"|'true')[^>]*><\/div>/g;
const DOCUMENT_EMBED_RE = /<div[^>]*data-document-embed=(?:"true"|'true')[^>]*><\/div>/g;
const MDX_AUDIO_RE = /<AudioEmbed\s+([^>]*?)\/>/g;
const MDX_DOCUMENT_RE = /<DocumentEmbed\s+([^>]*?)\/>/g;

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

export function mdxEmbedsToEditorHtml(markdown: string): string {
  return markdown
    .replace(MDX_AUDIO_RE, (_match, attrsRaw: string) => {
      const src = componentAttr(attrsRaw, "src");
      const title = componentAttr(attrsRaw, "title");
      return `<div data-audio-embed="true" data-src="${escapeHtmlAttr(src)}" data-title="${escapeHtmlAttr(title)}"></div>`;
    })
    .replace(MDX_DOCUMENT_RE, (_match, attrsRaw: string) => {
      const src = componentAttr(attrsRaw, "src");
      const title = componentAttr(attrsRaw, "title");
      const kind = componentAttr(attrsRaw, "kind") === "pdf" ? "pdf" : "document";
      return `<div data-document-embed="true" data-src="${escapeHtmlAttr(src)}" data-title="${escapeHtmlAttr(title)}" data-kind="${kind}"></div>`;
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

export function htmlEmbedsToMdx(markdown: string): string {
  return markdown
    .replace(AUDIO_EMBED_RE, (match: string) => {
      const src = attr(match, "src");
      const title = attr(match, "title");
      const titleAttr = title ? ` title="${title.replace(/"/g, "&quot;")}"` : "";
      return `<AudioEmbed src="${src}"${titleAttr} />`;
    })
    .replace(DOCUMENT_EMBED_RE, (match: string) => {
      const src = attr(match, "src");
      const title = attr(match, "title");
      const kind = attr(match, "kind") === "pdf" ? "pdf" : "document";
      const titleAttr = title ? ` title="${title.replace(/"/g, "&quot;")}"` : "";
      return `<DocumentEmbed src="${src}"${titleAttr} kind="${kind}" />`;
    });
}
