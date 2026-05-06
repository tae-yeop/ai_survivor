import type { PostAuthor, PostDifficulty, PostStatus } from "../content/posts.ts";
import { parsePostFrontmatter, renderPostBodyToHtml } from "../content/posts.ts";
import { assertValidPostSlug, normalizePostSlug } from "./slug.ts";

export type AdminPostDraft = {
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
  coverAlt: string | null;
  body: string;
};

export type AdminPostSummary = Pick<
  AdminPostDraft,
  "title" | "description" | "slug" | "publishedAt" | "updatedAt" | "status" | "category"
> & { source: "github" | "local" };

const POST_STATUSES: PostStatus[] = ["draft", "published", "scheduled", "archived"];
const POST_DIFFICULTIES: PostDifficulty[] = ["beginner", "intermediate", "advanced"];

function todayString(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${key} is required`);
  }
  return value.trim();
}

function optionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseStatus(value: string): PostStatus {
  if (!POST_STATUSES.includes(value as PostStatus)) {
    throw new Error("status is invalid");
  }
  return value as PostStatus;
}

function parseDifficulty(value: string): PostDifficulty {
  if (!POST_DIFFICULTIES.includes(value as PostDifficulty)) {
    throw new Error("difficulty is invalid");
  }
  return value as PostDifficulty;
}

function parseSeriesOrder(value: string | null) {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1)
    throw new Error("seriesOrder must be a positive integer");
  return parsed;
}

function yamlString(value: string) {
  return JSON.stringify(value);
}

function yamlNullableString(value: string | null) {
  return value ? yamlString(value) : "null";
}

function yamlNullableNumber(value: number | null) {
  return value === null ? "null" : String(value);
}

function yamlList(values: string[]) {
  return values.map((value) => `  - ${yamlString(value)}`).join("\n");
}

function splitMdxSource(source: string) {
  const normalized = source.replace(/^\uFEFF/, "");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(normalized);
  if (!match) throw new Error("Missing MDX frontmatter block");
  return { frontmatter: match[1] ?? "", body: match[2] ?? "" };
}

function scalarFromFrontmatter(frontmatter: string, key: string) {
  const match = new RegExp(`^${key}:\\s*(.*)$`, "m").exec(frontmatter);
  if (!match) return null;
  const raw = (match[1] ?? "").trim();
  if (!raw || raw === "null" || raw === "~") return null;
  if (raw.startsWith('"') && raw.endsWith('"')) {
    try {
      return JSON.parse(raw) as string;
    } catch {
      return raw.slice(1, -1);
    }
  }
  if (raw.startsWith("'") && raw.endsWith("'")) return raw.slice(1, -1).replaceAll("''", "'");
  return raw;
}

export function createEmptyAdminPostDraft(now = new Date()): AdminPostDraft {
  const today = todayString(now);
  return {
    title: "",
    description: "",
    slug: "",
    publishedAt: today,
    updatedAt: today,
    status: "draft",
    category: "vibe-coding-lab",
    tags: [],
    series: null,
    seriesOrder: null,
    author: "owner",
    difficulty: "beginner",
    tools: [],
    coverImage: null,
    coverAlt: null,
    body: "",
  };
}

export function adminPostDraftFromFormData(formData: FormData): AdminPostDraft {
  const title = requiredString(formData, "title");
  const rawSlug = optionalString(formData, "slug") ?? normalizePostSlug(title);
  const tags = splitList(requiredString(formData, "tags"));
  const tools = splitList(requiredString(formData, "tools"));
  if (tags.length === 0) throw new Error("tags must include at least one item");
  if (tools.length === 0) throw new Error("tools must include at least one item");

  return {
    title,
    description: requiredString(formData, "description"),
    slug: assertValidPostSlug(rawSlug),
    publishedAt: requiredString(formData, "publishedAt"),
    updatedAt: requiredString(formData, "updatedAt"),
    status: parseStatus(requiredString(formData, "status")),
    category: requiredString(formData, "category"),
    tags,
    series: optionalString(formData, "series"),
    seriesOrder: parseSeriesOrder(optionalString(formData, "seriesOrder")),
    author: "owner",
    difficulty: parseDifficulty(requiredString(formData, "difficulty")),
    tools,
    coverImage: optionalString(formData, "coverImage"),
    coverAlt: optionalString(formData, "coverAlt"),
    body: requiredString(formData, "body"),
  };
}

export function serializeAdminPostDraft(draft: AdminPostDraft) {
  const slug = assertValidPostSlug(draft.slug);
  const frontmatter = [
    `title: ${yamlString(draft.title)}`,
    `description: ${yamlString(draft.description)}`,
    `slug: ${yamlString(slug)}`,
    `publishedAt: ${draft.publishedAt}`,
    `updatedAt: ${draft.updatedAt}`,
    `status: ${draft.status}`,
    `category: ${yamlString(draft.category)}`,
    "tags:",
    yamlList(draft.tags),
    `series: ${yamlNullableString(draft.series)}`,
    `seriesOrder: ${yamlNullableNumber(draft.seriesOrder)}`,
    "author: owner",
    `difficulty: ${draft.difficulty}`,
    "tools:",
    yamlList(draft.tools),
    `coverImage: ${yamlNullableString(draft.coverImage)}`,
    `coverAlt: ${yamlNullableString(draft.coverAlt)}`,
  ].join("\n");

  parsePostFrontmatter(frontmatter, slug);
  renderPostBodyToHtml(draft.body);

  return `---\n${frontmatter}\n---\n\n${draft.body.trimEnd()}\n`;
}

export function parseAdminPostSource(source: string, slug: string): AdminPostDraft {
  const safeSlug = assertValidPostSlug(slug);
  const { frontmatter, body } = splitMdxSource(source);
  const metadata = parsePostFrontmatter(frontmatter, safeSlug);
  return {
    ...metadata,
    coverAlt: scalarFromFrontmatter(frontmatter, "coverAlt"),
    body: body.replace(/^\r?\n/, ""),
  };
}

export function toAdminPostSummary(
  draft: AdminPostDraft,
  source: AdminPostSummary["source"],
): AdminPostSummary {
  return {
    title: draft.title,
    description: draft.description,
    slug: draft.slug,
    publishedAt: draft.publishedAt,
    updatedAt: draft.updatedAt,
    status: draft.status,
    category: draft.category,
    source,
  };
}
