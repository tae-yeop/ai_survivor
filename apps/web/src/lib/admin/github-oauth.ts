import { randomBytes } from "node:crypto";
import type { AdminAuthConfig } from "./env.ts";

export const OAUTH_STATE_COOKIE = "aiv_admin_oauth_state";

export type GitHubUser = {
  id: number;
  login: string;
};

type OAuthTokenResponse = {
  access_token?: string;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
};

function githubHeaders(token?: string) {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2026-03-10",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function isGitHubUser(value: unknown): value is GitHubUser {
  if (!value || typeof value !== "object") return false;
  const user = value as Record<string, unknown>;
  return typeof user.login === "string" && Number.isInteger(user.id);
}

export function createOAuthState() {
  return randomBytes(32).toString("base64url");
}

export function oauthStateCookieOptions(maxAge = 60 * 10) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export function buildGitHubAuthorizationUrl(config: AdminAuthConfig, state: string) {
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", config.githubClientId);
  url.searchParams.set("redirect_uri", config.callbackUrl);
  url.searchParams.set("scope", "read:user");
  url.searchParams.set("state", state);
  return url;
}

export async function exchangeGitHubOAuthCode(config: AdminAuthConfig, code: string) {
  const body = new URLSearchParams({
    client_id: config.githubClientId,
    client_secret: config.githubClientSecret,
    code,
    redirect_uri: config.callbackUrl,
  });

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });
  const data = (await response.json()) as OAuthTokenResponse;

  if (!response.ok || data.error || !data.access_token) {
    throw new Error(data.error_description || data.error || "GitHub OAuth token exchange failed");
  }

  return data.access_token;
}

export async function fetchGitHubUser(accessToken: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: githubHeaders(accessToken),
    cache: "no-store",
  });
  const data: unknown = await response.json();
  if (!response.ok || !isGitHubUser(data)) {
    throw new Error("Unable to read GitHub user profile");
  }
  return data;
}

export function assertOwnerGitHubUser(user: GitHubUser, config: AdminAuthConfig) {
  const loginMatches = user.login.toLowerCase() === config.adminGithubLogin.toLowerCase();
  const idMatches = config.adminGithubId === null || user.id === config.adminGithubId;
  if (!loginMatches || !idMatches) {
    throw new Error("This GitHub account is not allowed to administer the site");
  }
}
