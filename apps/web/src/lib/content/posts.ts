import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { categoryLabel, labelFromSlug } from "../labels.ts";
import { slugifyTaxonomy } from "./slugify.ts";

export type PostStatus = "draft" | "published" | "scheduled" | "archived";
export type PostDifficulty = "beginner" | "intermediate" | "advanced";
export type PostAuthor = "owner";

export type Bucket = {
  slug: string;
  label: string;
  count: number;
};

export type PostFrontmatter = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  status: PostStatus;
  category: string;
  tags: string[];
  series: string | null;
  seriesOrder: number | null;
  author: PostAuthor;
  difficulty: PostDifficulty;
  tools: string[];
  coverImage: string | null;
};

export type Post = PostFrontmatter & {
  body: string;
  excerpt: string;
  readingTimeMinutes: number;
  sourcePath: string;
};

export type LoadPostsOptions = {
  now?: Date;
  includeNonPublic?: boolean;
};

type ReadPostsOptions = LoadPostsOptions & {
  root: string;
};

const POST_STATUSES = new Set<PostStatus>(["draft", "published", "scheduled", "archived"]);
const DIFFICULTIES = new Set<PostDifficulty>(["beginner", "intermediate", "advanced"]);
const AUTHORS = new Set<PostAuthor>(["owner"]);
const REQUIRED_FIELDS = [
  "title",
  "description",
  "slug",
  "publishedAt",
  "updatedAt",
  "status",
  "category",
  "tags",
  "author",
  "difficulty",
  "tools",
] as const;

const CONTENT_ROOT = path.join(process.cwd(), "content", "posts");

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseScalar(value: string): string | number | null | string[] {
  const trimmed = value.trim();
  if (trimmed === "" || trimmed === "null" || trimmed === "~") return null;
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return [];
    return inner
      .split(",")
      .map((item) => parseScalar(item.trim()))
      .map((item) => String(item));
  }
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    if (trimmed.startsWith('"')) {
      try {
        return JSON.parse(trimmed) as string;
      } catch {
        return trimmed.slice(1, -1);
      }
    }
    if (trimmed.startsWith("'")) return trimmed.slice(1, -1).replaceAll("''", "'");
    return trimmed.slice(1, -1);
  }
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

function parseYamlListItem(line: string) {
  const match = /^\s*-\s*(.*)$/.exec(line);
  if (!match) return null;
  const value = parseScalar(match[1] ?? "");
  return String(value);
}

function parseFrontmatterBlock(frontmatter: string) {
  const data: Record<string, unknown> = {};
  let currentListKey: string | null = null;

  for (const rawLine of frontmatter.split(/\r?\n/)) {
    const line = rawLine.replace(/\s+$/, "");
    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    const listItem = parseYamlListItem(line);
    if (listItem !== null && currentListKey) {
      const currentValue = data[currentListKey];
      if (!Array.isArray(currentValue)) data[currentListKey] = [];
      (data[currentListKey] as string[]).push(listItem);
      continue;
    }

    const pair = /^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/.exec(line);
    if (!pair) {
      throw new Error(`Invalid frontmatter line: ${line}`);
    }

    const [, key, value = ""] = pair;
    if (value.trim() === "") {
      data[key] = [];
      currentListKey = key;
    } else {
      data[key] = parseScalar(value);
      currentListKey = null;
    }
  }

  return data;
}

function requireString(data: Record<string, unknown>, key: string, errors: string[]) {
  const value = data[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(key);
    return "";
  }
  return value.trim();
}

function optionalString(data: Record<string, unknown>, key: string) {
  const value = data[key];
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") throw new Error(`${key} must be a string when provided`);
  return value.trim();
}

function optionalNumber(data: Record<string, unknown>, key: string) {
  const value = data[key];
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${key} must be a number when provided`);
  }
  return value;
}

function requireStringArray(data: Record<string, unknown>, key: string, errors: string[]) {
  const value = data[key];
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((item) => typeof item !== "string")
  ) {
    errors.push(key);
    return [];
  }
  return value.map((item) => item.trim()).filter(Boolean);
}

function assertDateString(value: string, field: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00.000Z`))) {
    throw new Error(`${field} must use YYYY-MM-DD format`);
  }
}

function isPublicPost(post: PostFrontmatter, now = new Date()) {
  if (post.status !== "published") return false;
  const publishedAt = new Date(`${post.publishedAt}T00:00:00.000Z`).getTime();
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  ).getTime();
  return publishedAt <= today;
}

export function parsePostFrontmatter(frontmatter: string, folderSlug: string): PostFrontmatter {
  const data = parseFrontmatterBlock(frontmatter);
  const missing = REQUIRED_FIELDS.filter(
    (field) => data[field] === undefined || data[field] === null,
  );
  const errors = [...missing];

  const title = requireString(data, "title", errors);
  const description = requireString(data, "description", errors);
  const slug = requireString(data, "slug", errors);
  const publishedAt = requireString(data, "publishedAt", errors);
  const updatedAt = requireString(data, "updatedAt", errors);
  const statusValue = requireString(data, "status", errors);
  const category = requireString(data, "category", errors);
  const tags = requireStringArray(data, "tags", errors);
  const authorValue = requireString(data, "author", errors);
  const difficultyValue = requireString(data, "difficulty", errors);
  const tools = requireStringArray(data, "tools", errors);

  if (errors.length > 0) {
    throw new Error(
      `Missing or invalid required frontmatter fields: ${[...new Set(errors)].join(", ")}`,
    );
  }
  if (slug !== folderSlug) {
    throw new Error(`Slug mismatch: folder "${folderSlug}" must match frontmatter slug "${slug}"`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`slug must be kebab-case: ${slug}`);
  }
  assertDateString(publishedAt, "publishedAt");
  assertDateString(updatedAt, "updatedAt");
  if (!POST_STATUSES.has(statusValue as PostStatus)) {
    throw new Error(`status must be one of ${[...POST_STATUSES].join(", ")}`);
  }
  if (!AUTHORS.has(authorValue as PostAuthor)) {
    throw new Error(`author must be one of ${[...AUTHORS].join(", ")}`);
  }
  if (!DIFFICULTIES.has(difficultyValue as PostDifficulty)) {
    throw new Error(`difficulty must be one of ${[...DIFFICULTIES].join(", ")}`);
  }

  return {
    title,
    description,
    slug,
    publishedAt,
    updatedAt,
    status: statusValue as PostStatus,
    category,
    tags,
    series: optionalString(data, "series"),
    seriesOrder: optionalNumber(data, "seriesOrder"),
    author: authorValue as PostAuthor,
    difficulty: difficultyValue as PostDifficulty,
    tools,
    coverImage: optionalString(data, "coverImage"),
  };
}

function extractFrontmatter(source: string, sourcePath: string) {
  const normalizedSource = source.replace(/^\uFEFF/, "");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(normalizedSource);
  if (!match) {
    throw new Error(`Missing frontmatter block in ${sourcePath}`);
  }
  return { frontmatter: match[1] ?? "", body: match[2] ?? "" };
}

export function assertSafeMdxBody(body: string) {
  const checks: Array<[RegExp, string]> = [
    [/<\/?script\b/i, "script tags are not allowed"],
    [/<\/?style\b/i, "style tags are not allowed"],
    [/<\/?object\b/i, "object tags are not allowed"],
    [/<\/?embed\b/i, "embed tags are not allowed"],
    [/\son[a-z]+\s*=/i, "inline event handlers are not allowed"],
    [/javascript:/i, "javascript: URLs are not allowed"],
  ];
  for (const [pattern, reason] of checks) {
    if (pattern.test(body)) throw new Error(`Unsafe post body: ${reason}`);
  }
}

function excerptFromBody(body: string, description: string) {
  const text = body
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`>\-[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text ? `${text.slice(0, 140)}${text.length > 140 ? "…" : ""}` : description;
}

function readingTimeMinutes(body: string) {
  const plain = body
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const latinWords = plain.match(/[A-Za-z0-9]+/g)?.length ?? 0;
  const cjkChars = plain.match(/[\u3131-\uD79D\u4E00-\u9FFF]/g)?.length ?? 0;
  const wordEstimate = latinWords + Math.ceil(cjkChars / 3);
  return Math.max(1, Math.ceil(wordEstimate / 250));
}

function readPostFile(filePath: string, folderSlug: string): Post {
  const source = readFileSync(filePath, "utf8");
  const { frontmatter, body } = extractFrontmatter(source, filePath);
  const metadata = parsePostFrontmatter(frontmatter, folderSlug);
  assertSafeMdxBody(body);
  return {
    ...metadata,
    body: body.trim(),
    excerpt: excerptFromBody(body, metadata.description),
    readingTimeMinutes: readingTimeMinutes(body),
    sourcePath: filePath,
  };
}

function readPostsFromRoot({ root, now = new Date(), includeNonPublic = false }: ReadPostsOptions) {
  if (!existsSync(root)) return [];

  const posts = readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const filePath = path.join(root, entry.name, "index.mdx");
      if (!existsSync(filePath)) {
        throw new Error(`Missing index.mdx for post folder: ${entry.name}`);
      }
      return readPostFile(filePath, entry.name);
    });

  const seen = new Set<string>();
  for (const post of posts) {
    if (seen.has(post.slug)) throw new Error(`Duplicate post slug: ${post.slug}`);
    seen.add(post.slug);
  }

  return posts
    .filter((post) => includeNonPublic || isPublicPost(post, now))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title));
}

export function loadPosts(options: LoadPostsOptions = {}) {
  return readPostsFromRoot({ root: CONTENT_ROOT, ...options });
}

export function loadPostsForTest(options: ReadPostsOptions) {
  return readPostsFromRoot(options);
}

export function getPublishedPosts(options: Omit<LoadPostsOptions, "includeNonPublic"> = {}) {
  return loadPosts({ ...options, includeNonPublic: false });
}

export const publishedPosts = getPublishedPosts();

export function getPostBySlug(slug: string, opts?: { includeDrafts?: boolean }) {
  const list = opts?.includeDrafts ? loadPosts({ includeNonPublic: true }) : publishedPosts;
  return list.find((post) => post.slug === slug) ?? null;
}

export function getPostsByCategory(slug: string) {
  return publishedPosts.filter((post) => slugifyTaxonomy(post.category) === slug);
}

export function getPostsByTag(slug: string) {
  return publishedPosts.filter((post) =>
    post.tags.some((tag) => slugifyTaxonomy(tag) === slug),
  );
}

export function getPostsBySeries(series: string) {
  return publishedPosts
    .filter((post) => post.series === series)
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
}

export function getPostsByTool(tool: string) {
  const normalized = slugify(tool);
  return publishedPosts.filter((post) => post.tools.some((item) => slugify(item) === normalized));
}

function bucketBy(values: string[], labeler: (slug: string) => string): Bucket[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, label: labeler(slug), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function categoryBuckets(): Bucket[] {
  type Group = { rawValues: Set<string>; count: number };
  const bySlug = new Map<string, Group>();

  for (const post of publishedPosts) {
    const slug = slugifyTaxonomy(post.category);
    if (!slug) continue; // defensive — slugify-empty values don't get a bucket
    const group = bySlug.get(slug) ?? { rawValues: new Set<string>(), count: 0 };
    group.rawValues.add(post.category);
    group.count += 1;
    bySlug.set(slug, group);
  }

  return [...bySlug.entries()]
    .map(([slug, { rawValues, count }]) => {
      if (rawValues.size > 1) {
        const arr = [...rawValues];
        const message = `slug-collision: ${arr.map((v) => `"${v}"`).join(" and ")} both → /${slug}`;
        if (process.env.NODE_ENV === "production") {
          throw new Error(message);
        }
        // eslint-disable-next-line no-console
        console.warn(message);
      }
      const firstRaw = [...rawValues][0]!;
      return { slug, label: categoryLabel(firstRaw), count };
    })
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function tagBuckets(): Bucket[] {
  type Group = { rawValues: Set<string>; count: number };
  const bySlug = new Map<string, Group>();

  for (const post of publishedPosts) {
    for (const tag of post.tags) {
      const slug = slugifyTaxonomy(tag);
      if (!slug) continue;
      const group = bySlug.get(slug) ?? { rawValues: new Set<string>(), count: 0 };
      group.rawValues.add(tag);
      group.count += 1;
      bySlug.set(slug, group);
    }
  }

  return [...bySlug.entries()]
    .map(([slug, { rawValues, count }]) => {
      if (rawValues.size > 1) {
        const arr = [...rawValues];
        const message = `slug-collision: ${arr.map((v) => `"${v}"`).join(" and ")} both → /${slug}`;
        if (process.env.NODE_ENV === "production") {
          throw new Error(message);
        }
        // eslint-disable-next-line no-console
        console.warn(message);
      }
      const firstRaw = [...rawValues][0]!;
      // For tags, prefer the raw string as label since there's no CATEGORY_LABELS analogue.
      return { slug, label: firstRaw, count };
    })
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function seriesBuckets(): Bucket[] {
  return bucketBy(
    publishedPosts.flatMap((post) => (post.series ? [post.series] : [])),
    labelFromSlug,
  );
}

export function toolBuckets(): Bucket[] {
  return bucketBy(
    publishedPosts.flatMap((post) => post.tools.map((tool) => slugify(tool))),
    labelFromSlug,
  );
}
