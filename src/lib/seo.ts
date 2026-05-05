import type { Post } from './posts';
import { SITE_URL, DEFAULT_OG_IMAGE, SITE_NAME } from './site';

export interface SeoMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogType: 'website' | 'article';
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  keywords?: string[];
  noindex?: boolean;
}

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return joinUrl(SITE_URL, path);
}

export function buildPageSeo(opts: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noindex?: boolean;
}): SeoMeta {
  return {
    title: opts.title,
    description: opts.description,
    canonical: absoluteUrl(opts.path),
    ogImage: absoluteUrl(opts.ogImage ?? DEFAULT_OG_IMAGE),
    ogType: 'website',
    noindex: opts.noindex,
  };
}

export function buildPostSeo(post: Post, path: string): SeoMeta {
  const { data } = post;
  return {
    title: data.title,
    description: data.description,
    canonical: data.canonical ?? absoluteUrl(path),
    ogImage: absoluteUrl(
      data.ogImage ?? (typeof data.coverImage === 'string' ? data.coverImage : DEFAULT_OG_IMAGE),
    ),
    ogType: 'article',
    publishedAt: data.publishedAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
    author: data.author,
    keywords: data.tags,
    noindex: data.draft === true,
  };
}

export function buildArticleJsonLd(post: Post, path: string) {
  const seo = buildPostSeo(post, path);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.data.title,
    description: post.data.description,
    datePublished: seo.publishedAt,
    dateModified: seo.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': seo.canonical,
    },
    image: [seo.ogImage],
    author: {
      '@type': 'Person',
      name: post.data.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/images/og/default.png'),
      },
    },
    keywords: post.data.tags.join(', '),
    inLanguage: 'ko-KR',
  };
}
