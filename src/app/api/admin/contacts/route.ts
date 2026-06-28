import { NextResponse } from "next/server";
import { sessionRole } from "@/auth";
import { listContacts } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ contacts: await listContacts() });
}
