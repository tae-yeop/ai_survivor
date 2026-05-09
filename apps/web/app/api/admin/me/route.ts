import { NextResponse } from "next/server";
import { adminIdentityFromSession } from "@/lib/admin/identity";
import { getAdminSession } from "@/lib/admin/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json(adminIdentityFromSession(session));
}
