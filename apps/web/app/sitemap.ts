import type { MetadataRoute } from "next";
import {
  categoryBuckets,
  publishedPosts,
  seriesBuckets,
  tagBuckets,
  toolBuckets,
} from "@/lib/content/posts";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/posts",
    "/categories",
    "/tags",
    "/series",
    "/tools",
    "/about",
    "/contact",
    "/privacy",
  ];
  const postPaths = publishedPosts.map((post) => `/posts/${post.slug}`);
  const categoryPaths = categoryBuckets().map((item) => `/categories/${item.slug}`);
  const tagPaths = tagBuckets().map((item) => `/tags/${item.slug}`);
  const seriesPaths = seriesBuckets().map((item) => `/series/${item.slug}`);
  const toolPaths = toolBuckets().map((item) => `/tools/${item.slug}`);

  return [
    ...staticPaths,
    ...postPaths,
    ...categoryPaths,
    ...tagPaths,
    ...seriesPaths,
    ...toolPaths,
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path.startsWith("/posts/") ? "monthly" : "weekly",
    priority: path === "/" ? 1 : path.startsWith("/posts/") ? 0.8 : 0.6,
  }));
}
