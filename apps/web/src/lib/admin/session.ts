import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createAdminSessionToken,
  verifyAdminSessionToken,
  type AdminSessionPayload,
} from "./session-token.ts";

export const ADMIN_SESSION_COOKIE = "aiv_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

export function adminCookieOptions(maxAge = ADMIN_SESSION_MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
    priority: "high" as const,
  };
}

export function createSessionPayload(
  login: string,
  id: number,
  now = Date.now(),
): AdminSessionPayload {
  return {
    login,
    id,
    exp: now + ADMIN_SESSION_MAX_AGE_SECONDS * 1000,
  };
}

export function createAdminSessionCookie(
  login: string,
  id: number,
  secret: string,
  now = Date.now(),
) {
  return createAdminSessionToken(createSessionPayload(login, id, now), secret);
}

export async function getAdminSession() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret) return null;
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token, secret);
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
