function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function escapeMdxAttribute(value: string) {
  return decodeHtmlEntities(value).replace(/"/g, "&quot;");
}

function readAttribute(raw: string, name: string) {
  const pattern = new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const match = pattern.exec(raw);
  return decodeHtmlEntities(match?.[1] ?? match?.[2] ?? match?.[3] ?? "");
}

function normalizeInlineWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function inlineToMarkdown(html: string): string {
  let text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _tag, body: string) => {
      const inner = inlineToMarkdown(body);
      return inner ? `**${inner}**` : "";
    })
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _tag, body: string) => {
      const inner = inlineToMarkdown(body);
      return inner ? `*${inner}*` : "";
    })
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_m, body: string) => {
      const inner = normalizeInlineWhitespace(decodeHtmlEntities(body.replace(/<[^>]+>/g, "")));
      return inner ? `\`${inner.replace(/`/g, "\\`")}\`` : "";
    })
    .replace(/<u\b[^>]*>([\s\S]*?)<\/u>/gi, (_m, body: string) => {
      const inner = inlineToMarkdown(body);
      return inner ? `<u>${inner}</u>` : "";
    })
    .replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (_m, attrs: string, body: string) => {
      const label = inlineToMarkdown(body);
      const href = readAttribute(attrs, "href");
      return label && href ? `[${label}](${href})` : label;
    });

  text = text.replace(/<[^>]+>/g, "");
  return normalizeInlineWhitespace(decodeHtmlEntities(text));
}

function figureToMdx(attrs: string, innerHtml: string) {
  const img = /<img\b([^>]*)\/?>/i.exec(innerHtml);
  if (!img) return "";

  const imgAttrs = img[1] ?? "";
  const src = readAttribute(imgAttrs, "src");
  if (!src) return "";

  const alt = readAttribute(imgAttrs, "alt");
  const width = readAttribute(attrs, "data-width") || readAttribute(imgAttrs, "width");
  const align = readAttribute(attrs, "data-align");
  const captionFromAttr = readAttribute(attrs, "data-caption");
  const captionFromTag = /<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i.exec(innerHtml)?.[1];
  const caption = captionFromAttr || (captionFromTag ? inlineToMarkdown(captionFromTag) : "");

  const parts = [
    `src="${escapeMdxAttribute(src)}"`,
    `alt="${escapeMdxAttribute(alt)}"`,
    width && width !== "100%" ? `width="${escapeMdxAttribute(width)}"` : "",
    align && align !== "center" ? `align="${escapeMdxAttribute(align)}"` : "",
    caption ? `caption="${escapeMdxAttribute(caption)}"` : "",
  ].filter(Boolean);

  return `<Figure ${parts.join(" ")} />`;
}

function imageToMdx(attrs: string) {
  const src = readAttribute(attrs, "src");
  if (!src) return "";
  const alt = readAttribute(attrs, "alt");
  const width = readAttribute(attrs, "width");
  const parts = [
    `src="${escapeMdxAttribute(src)}"`,
    `alt="${escapeMdxAttribute(alt)}"`,
    width && width !== "100%" ? `width="${escapeMdxAttribute(width)}"` : "",
  ].filter(Boolean);
  return `<Figure ${parts.join(" ")} />`;
}

function listToMarkdown(body: string, ordered: boolean) {
  let index = 1;
  const lines = [...body.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => inlineToMarkdown(match[1] ?? ""))
    .filter(Boolean)
    .map((item) => (ordered ? `${index++}. ${item}` : `- ${item}`));
  return lines.join("\n");
}

function extractBody(html: string) {
  return /<body\b[^>]*>([\s\S]*?)<\/body>/i.exec(html)?.[1] ?? html;
}

function normalizeMarkdown(markdown: string) {
  return markdown
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stripResidualHtml(markdown: string) {
  const figures: string[] = [];
  let text = markdown.replace(/<Figure\b[^>]*\/>/g, (figure) => {
    const token = `@@FIGURE_${figures.length}@@`;
    figures.push(figure);
    return token;
  });

  text = text
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _tag, body: string) => {
      const inner = inlineToMarkdown(body);
      return inner ? `**${inner}**` : "";
    })
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _tag, body: string) => {
      const inner = inlineToMarkdown(body);
      return inner ? `*${inner}*` : "";
    })
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_m, body: string) => {
      const inner = normalizeInlineWhitespace(decodeHtmlEntities(body.replace(/<[^>]+>/g, "")));
      return inner ? `\`${inner.replace(/`/g, "\\`")}\`` : "";
    })
    .replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (_m, attrs: string, body: string) => {
      const label = inlineToMarkdown(body);
      const href = readAttribute(attrs, "href");
      return label && href ? `[${label}](${href})` : label;
    })
    .replace(/<[^>]+>/g, "");

  text = decodeHtmlEntities(text);
  figures.forEach((figure, index) => {
    text = text.replace(`@@FIGURE_${index}@@`, figure);
  });
  return text;
}

export function htmlToMdx(html: string): string {
  let mdx = extractBody(html)
    .replace(/\r\n?/g, "\n")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe)\b[\s\S]*?<\/\1>/gi, "");

  mdx = mdx
    .replace(/<figure\b([^>]*)>([\s\S]*?)<\/figure>/gi, (_m, attrs: string, body: string) => {
      const figure = figureToMdx(attrs, body);
      return figure ? `\n\n${figure}\n\n` : "";
    })
    .replace(/<img\b([^>]*)\/?>/gi, (_m, attrs: string) => {
      const image = imageToMdx(attrs);
      return image ? `\n\n${image}\n\n` : "";
    })
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_m, level: string, body: string) => {
      const title = inlineToMarkdown(body);
      return title ? `\n\n${"#".repeat(Number(level))} ${title}\n\n` : "";
    })
    .replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, body: string) => {
      const quote = inlineToMarkdown(body);
      return quote
        ? `\n\n${quote
            .split("\n")
            .map((line) => `> ${line}`)
            .join("\n")}\n\n`
        : "";
    })
    .replace(/<ul\b[^>]*>([\s\S]*?)<\/ul>/gi, (_m, body: string) => {
      const list = listToMarkdown(body, false);
      return list ? `\n\n${list}\n\n` : "";
    })
    .replace(/<ol\b[^>]*>([\s\S]*?)<\/ol>/gi, (_m, body: string) => {
      const list = listToMarkdown(body, true);
      return list ? `\n\n${list}\n\n` : "";
    })
    .replace(/<hr\s*\/?>/gi, "\n\n---\n\n")
    .replace(/<(p|div|section|article)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _tag, body: string) => {
      const paragraph = inlineToMarkdown(body);
      return paragraph ? `\n\n${paragraph}\n\n` : "";
    })
    .replace(/<br\s*\/?>/gi, "\n");

  return normalizeMarkdown(stripResidualHtml(mdx));
}
