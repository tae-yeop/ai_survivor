import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, adminCookieOptions } from "@/lib/admin/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login?signed_out=1", request.url));
  response.cookies.set(ADMIN_SESSION_COOKIE, "", adminCookieOptions(0));
  return response;
}
