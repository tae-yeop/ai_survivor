import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** Hide drafts in production builds; show them in `astro dev`. */
export function isVisible(post: Post): boolean {
  return import.meta.env.PROD ? post.data.draft !== true : true;
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', isVisible);
  return posts.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );
}

export function postUrl(post: Post): string {
  return `/posts/${post.data.slug}/`;
}

export function getPostBySlug(slug: string, posts: Post[]): Post | undefined {
  return posts.find((p) => p.data.slug === slug);
}

/**
 * Pick up to `limit` related posts. Same series first (ordered by
 * seriesOrder), then same category, then shared tags. Excludes the source post.
 */
export function getRelatedPosts(post: Post, posts: Post[], limit = 4): Post[] {
  const others = posts.filter((p) => p.data.slug !== post.data.slug);
  const seen = new Set<string>();
  const result: Post[] = [];
  const push = (p: Post) => {
    if (seen.has(p.data.slug)) return;
    seen.add(p.data.slug);
    result.push(p);
  };

  if (post.data.series) {
    others
      .filter((p) => p.data.series === post.data.series)
      .sort(
        (a, b) =>
          (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0),
      )
      .forEach(push);
  }

  others
    .filter((p) => p.data.category === post.data.category)
    .forEach(push);

  const postTags = new Set(post.data.tags);
  others
    .map((p) => ({
      post: p,
      shared: p.data.tags.filter((t) => postTags.has(t)).length,
    }))
    .filter((x) => x.shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .forEach((x) => push(x.post));

  return result.slice(0, limit);
}

export function getSeriesPosts(series: string, posts: Post[]): Post[] {
  return posts
    .filter((p) => p.data.series === series)
    .sort(
      (a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0),
    );
}

export function getSeriesNeighbors(post: Post, posts: Post[]) {
  if (!post.data.series) return { prev: undefined, next: undefined };
  const series = getSeriesPosts(post.data.series, posts);
  const idx = series.findIndex((p) => p.data.slug === post.data.slug);
  return {
    prev: idx > 0 ? series[idx - 1] : undefined,
    next: idx >= 0 && idx < series.length - 1 ? series[idx + 1] : undefined,
  };
}
