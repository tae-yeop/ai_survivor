import { publishedPosts } from "@/lib/content/posts";
import { absoluteUrl, RSS_DESCRIPTION, RSS_TITLE, SITE_LANG } from "@/lib/site";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const items = publishedPosts
    .slice(0, 20)
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${absoluteUrl(`/posts/${post.slug}`)}</link>
      <guid>${absoluteUrl(`/posts/${post.slug}`)}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>
  `,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${escapeXml(RSS_TITLE)}</title>
      <link>${absoluteUrl("/")}</link>
      <description>${escapeXml(RSS_DESCRIPTION)}</description>
      <language>${SITE_LANG}</language>
      ${items}
    </channel>
  </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
