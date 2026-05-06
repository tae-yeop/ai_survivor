import type { AdminContentConfig } from "./env.ts";
import { parseAdminPostSource, toAdminPostSummary, type AdminPostSummary } from "./mdx.ts";
import { assertValidPostSlug, postContentPath } from "./slug.ts";

const CONTENT_ROOT_PATH = "apps/web/content/posts";

type GitHubContentFileResponse = {
  type?: string;
  encoding?: string;
  content?: string;
  path?: string;
  sha?: string;
};

type GitHubDirectoryItem = {
  name?: string;
  path?: string;
  type?: string;
};

type GitHubPutResponse = {
  commit?: {
    sha?: string;
    html_url?: string;
  };
  content?: {
    path?: string;
    sha?: string;
  } | null;
};

export type GitHubContentFile = {
  path: string;
  sha: string;
  source: string;
};

export type GitHubCommitResult = {
  commitSha: string | null;
  commitUrl: string | null;
  path: string;
};

function encodePath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function repoContentsUrl(config: AdminContentConfig, path: string, includeRef = true) {
  const url = new URL(
    `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${encodePath(path)}`,
  );
  if (includeRef) url.searchParams.set("ref", config.branch);
  return url;
}

function headers(config: AdminContentConfig) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${config.token}`,
    "X-GitHub-Api-Version": "2026-03-10",
  };
}

async function errorMessage(response: Response) {
  const text = await response.text();
  try {
    const parsed = JSON.parse(text) as { message?: string };
    return parsed.message || text;
  } catch {
    return text;
  }
}

function isFileResponse(value: unknown): value is GitHubContentFileResponse {
  if (!value || typeof value !== "object") return false;
  const file = value as Record<string, unknown>;
  return file.type === "file" && typeof file.sha === "string" && typeof file.content === "string";
}

function isDirectoryListing(value: unknown): value is GitHubDirectoryItem[] {
  return Array.isArray(value);
}

export { postContentPath };

export async function getGitHubContentFile(config: AdminContentConfig, path: string) {
  const response = await fetch(repoContentsUrl(config, path), {
    headers: headers(config),
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub content read failed: ${await errorMessage(response)}`);

  const data: unknown = await response.json();
  if (!isFileResponse(data) || data.encoding !== "base64") {
    throw new Error("GitHub content response was not a base64 file");
  }
  const sha = data.sha;
  const content = data.content;
  if (!sha || !content) throw new Error("GitHub content response was missing file data");

  return {
    path: data.path ?? path,
    sha,
    source: Buffer.from(content.replace(/\s/g, ""), "base64").toString("utf8"),
  } satisfies GitHubContentFile;
}

async function putGitHubContentBase64(
  config: AdminContentConfig,
  path: string,
  base64: string,
  message: string,
  sha?: string,
): Promise<GitHubCommitResult> {
  const response = await fetch(repoContentsUrl(config, path, false), {
    method: "PUT",
    headers: {
      ...headers(config),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: base64,
      branch: config.branch,
      ...(sha ? { sha } : {}),
    }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`GitHub content write failed: ${await errorMessage(response)}`);
  const data = (await response.json()) as GitHubPutResponse;
  return {
    commitSha: data.commit?.sha ?? null,
    commitUrl: data.commit?.html_url ?? null,
    path,
  };
}

export function putGitHubContentFile(
  config: AdminContentConfig,
  path: string,
  source: string,
  message: string,
  sha?: string,
) {
  return putGitHubContentBase64(
    config,
    path,
    Buffer.from(source, "utf8").toString("base64"),
    message,
    sha,
  );
}

export function putGitHubBinaryFile(
  config: AdminContentConfig,
  path: string,
  data: Buffer,
  message: string,
  sha?: string,
) {
  return putGitHubContentBase64(config, path, data.toString("base64"), message, sha);
}

export async function getPostSourceFromGitHub(config: AdminContentConfig, slug: string) {
  return getGitHubContentFile(config, postContentPath(slug));
}

export async function savePostSourceToGitHub(
  config: AdminContentConfig,
  slug: string,
  source: string,
  message: string,
) {
  const path = postContentPath(slug);
  const currentFile = await getGitHubContentFile(config, path);
  return putGitHubContentFile(config, path, source, message, currentFile?.sha);
}

export async function listPostSlugsFromGitHub(config: AdminContentConfig) {
  const response = await fetch(repoContentsUrl(config, CONTENT_ROOT_PATH), {
    headers: headers(config),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`GitHub post list failed: ${await errorMessage(response)}`);
  const data: unknown = await response.json();
  if (!isDirectoryListing(data)) throw new Error("GitHub post list response was not a directory");

  return data
    .filter((item) => item.type === "dir" && typeof item.name === "string")
    .map((item) => assertValidPostSlug(item.name ?? ""))
    .sort((a, b) => a.localeCompare(b));
}

export async function listAdminPostsFromGitHub(
  config: AdminContentConfig,
): Promise<AdminPostSummary[]> {
  const slugs = await listPostSlugsFromGitHub(config);
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const file = await getPostSourceFromGitHub(config, slug);
      if (!file) throw new Error(`Missing index.mdx for GitHub post ${slug}`);
      return toAdminPostSummary(parseAdminPostSource(file.source, slug), "github");
    }),
  );

  return posts.sort(
    (a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.title.localeCompare(b.title),
  );
}
