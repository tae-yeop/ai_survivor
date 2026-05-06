import { SITE_URL } from "../site.ts";

const MIN_SESSION_SECRET_LENGTH = 32;

export type AdminAuthConfig = {
  siteUrl: string;
  callbackUrl: string;
  githubClientId: string;
  githubClientSecret: string;
  adminGithubLogin: string;
  adminGithubId: number | null;
  sessionSecret: string;
};

export type AdminContentConfig = {
  repoFullName: string;
  owner: string;
  repo: string;
  branch: string;
  token: string;
};

export type AdminConfigStatus<T> =
  | { configured: true; missing: []; config: T }
  | { configured: false; missing: string[]; config: null };

function envValue(key: string) {
  const value = process.env[key]?.trim();
  return value ? value : null;
}

function siteUrl() {
  return envValue("NEXT_PUBLIC_SITE_URL") ?? SITE_URL;
}

function optionalNumberEnv(key: string) {
  const value = envValue(key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseRepo(value: string | null) {
  if (!value) return null;
  const match = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/.exec(value);
  if (!match) return null;
  return { owner: match[1], repo: match[2], repoFullName: value };
}

export function getAdminAuthConfigStatus(): AdminConfigStatus<AdminAuthConfig> {
  const missing: string[] = [];
  const githubClientId = envValue("GITHUB_CLIENT_ID");
  const githubClientSecret = envValue("GITHUB_CLIENT_SECRET");
  const adminGithubLogin = envValue("ADMIN_GITHUB_LOGIN");
  const sessionSecret = envValue("ADMIN_SESSION_SECRET");

  if (!githubClientId) missing.push("GITHUB_CLIENT_ID");
  if (!githubClientSecret) missing.push("GITHUB_CLIENT_SECRET");
  if (!adminGithubLogin) missing.push("ADMIN_GITHUB_LOGIN");
  if (!sessionSecret || sessionSecret.length < MIN_SESSION_SECRET_LENGTH) {
    missing.push("ADMIN_SESSION_SECRET (32+ chars)");
  }

  if (
    missing.length > 0 ||
    !githubClientId ||
    !githubClientSecret ||
    !adminGithubLogin ||
    !sessionSecret
  ) {
    return { configured: false, missing, config: null };
  }

  const baseUrl = siteUrl();
  return {
    configured: true,
    missing: [],
    config: {
      siteUrl: baseUrl,
      callbackUrl: new URL("/api/admin/github/callback", baseUrl).toString(),
      githubClientId,
      githubClientSecret,
      adminGithubLogin,
      adminGithubId: optionalNumberEnv("ADMIN_GITHUB_ID"),
      sessionSecret,
    },
  };
}

export function getAdminContentConfigStatus(): AdminConfigStatus<AdminContentConfig> {
  const missing: string[] = [];
  const repo = parseRepo(envValue("GITHUB_REPO"));
  const token = envValue("GITHUB_CONTENT_TOKEN");
  const branch = envValue("GITHUB_BRANCH") ?? "master";

  if (!repo) missing.push("GITHUB_REPO (owner/repo)");
  if (!token) missing.push("GITHUB_CONTENT_TOKEN");

  if (missing.length > 0 || !repo || !token) {
    return { configured: false, missing, config: null };
  }

  return {
    configured: true,
    missing: [],
    config: {
      ...repo,
      branch,
      token,
    },
  };
}

export function getAdminSetupStatus() {
  return {
    auth: getAdminAuthConfigStatus(),
    content: getAdminContentConfigStatus(),
  };
}

export function missingEnvMessage(missing: string[]) {
  return missing.length > 0 ? missing.join(", ") : "unknown admin configuration";
}
