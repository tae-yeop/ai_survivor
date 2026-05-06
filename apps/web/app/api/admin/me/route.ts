import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ admin: false }, { status: 401 });
  }
  return NextResponse.json({ admin: true, login: session.login });
}
