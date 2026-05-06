export const POST_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizePostSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function assertValidPostSlug(value: string) {
  if (value.includes("..") || value.includes("/") || value.includes("\\")) {
    throw new Error("Post slug contains an unsafe path segment");
  }
  const slug = normalizePostSlug(value);
  if (!slug || !POST_SLUG_PATTERN.test(slug)) {
    throw new Error("Post slug must be lowercase kebab-case letters and numbers");
  }
  return slug;
}

export function postContentPath(slug: string) {
  return `apps/web/content/posts/${assertValidPostSlug(slug)}/index.mdx`;
}
