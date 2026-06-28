import { NextResponse } from "next/server";
import { currentRole } from "@/lib/auth";
import { listMembers } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if ((await currentRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ members: await listMembers() });
}
