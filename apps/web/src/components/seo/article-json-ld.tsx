import { absoluteUrl, SITE_NAME } from "@/lib/site";
import type { Post } from "@/lib/content/posts";

export function ArticleJsonLd({ post }: { post: Post }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: absoluteUrl(`/posts/${post.slug}`),
    author: {
      "@type": "Person",
      name: "AI Vibe Lab 운영자",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
