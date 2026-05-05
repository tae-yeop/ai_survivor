import type { Post } from './posts';
import { toSlug } from './labels';

export interface TaxonomyEntry {
  slug: string;
  label: string; // human-readable label (Korean for tools/tags as authored)
  count: number;
  posts: Post[];
}

function bucket(
  posts: Post[],
  pick: (p: Post) => string[] | undefined,
): TaxonomyEntry[] {
  const map = new Map<string, { label: string; posts: Post[] }>();
  for (const post of posts) {
    const values = pick(post) ?? [];
    for (const value of values) {
      const slug = toSlug(value);
      if (!slug) continue;
      const bucket = map.get(slug) ?? { label: value, posts: [] };
      bucket.posts.push(post);
      map.set(slug, bucket);
    }
  }
  return [...map.entries()]
    .map(([slug, { label, posts }]) => ({
      slug,
      label,
      count: posts.length,
      posts: posts.sort(
        (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
      ),
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'ko'));
}

export function tagBuckets(posts: Post[]): TaxonomyEntry[] {
  return bucket(posts, (p) => p.data.tags);
}

export function toolBuckets(posts: Post[]): TaxonomyEntry[] {
  return bucket(posts, (p) => p.data.tools);
}

export function categoryBuckets(posts: Post[]): TaxonomyEntry[] {
  return bucket(posts, (p) => [p.data.category]);
}

export function seriesBuckets(posts: Post[]): TaxonomyEntry[] {
  return bucket(posts, (p) => (p.data.series ? [p.data.series] : []));
}
