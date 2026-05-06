import { NextRequest, NextResponse } from "next/server";
import { getAdminAuthConfigStatus, missingEnvMessage } from "@/lib/admin/env";
import {
  assertOwnerGitHubUser,
  exchangeGitHubOAuthCode,
  fetchGitHubUser,
  oauthStateCookieOptions,
  OAUTH_STATE_COOKIE,
} from "@/lib/admin/github-oauth";
import {
  adminCookieOptions,
  ADMIN_SESSION_COOKIE,
  createAdminSessionCookie,
} from "@/lib/admin/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function redirectToLogin(request: NextRequest, message: string) {
  const url = new URL("/admin/login", request.url);
  url.searchParams.set("error", message);
  const response = NextResponse.redirect(url);
  response.cookies.set(OAUTH_STATE_COOKIE, "", oauthStateCookieOptions(0));
  return response;
}

export async function GET(request: NextRequest) {
  const authStatus = getAdminAuthConfigStatus();
  if (!authStatus.configured) {
    return redirectToLogin(
      request,
      `Missing login config: ${missingEnvMessage(authStatus.missing)}`,
    );
  }

  const code = request.nextUrl.searchParams.get("code");
  const returnedState = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;
  const oauthError =
    request.nextUrl.searchParams.get("error_description") ??
    request.nextUrl.searchParams.get("error");

  if (oauthError) return redirectToLogin(request, oauthError);
  if (!code) return redirectToLogin(request, "GitHub OAuth callback did not include a code");
  if (!returnedState || !expectedState || returnedState !== expectedState) {
    return redirectToLogin(request, "GitHub OAuth state check failed");
  }

  try {
    const accessToken = await exchangeGitHubOAuthCode(authStatus.config, code);
    const user = await fetchGitHubUser(accessToken);
    assertOwnerGitHubUser(user, authStatus.config);

    const response = NextResponse.redirect(new URL("/admin", request.url));
    response.cookies.set(
      ADMIN_SESSION_COOKIE,
      createAdminSessionCookie(user.login, user.id, authStatus.config.sessionSecret),
      adminCookieOptions(),
    );
    response.cookies.set(OAUTH_STATE_COOKIE, "", oauthStateCookieOptions(0));
    return response;
  } catch (error) {
    return redirectToLogin(
      request,
      error instanceof Error ? error.message : "GitHub OAuth login failed",
    );
  }
}
