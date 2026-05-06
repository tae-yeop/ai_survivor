import { NextResponse } from "next/server";
import { getAdminAuthConfigStatus, missingEnvMessage } from "@/lib/admin/env";
import {
  buildGitHubAuthorizationUrl,
  createOAuthState,
  oauthStateCookieOptions,
  OAUTH_STATE_COOKIE,
} from "@/lib/admin/github-oauth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const authStatus = getAdminAuthConfigStatus();
  if (!authStatus.configured) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("error", `Missing login config: ${missingEnvMessage(authStatus.missing)}`);
    return NextResponse.redirect(url);
  }

  const state = createOAuthState();
  const response = NextResponse.redirect(buildGitHubAuthorizationUrl(authStatus.config, state));
  response.cookies.set(OAUTH_STATE_COOKIE, state, oauthStateCookieOptions());
  return response;
}
