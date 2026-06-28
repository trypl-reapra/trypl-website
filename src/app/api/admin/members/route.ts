import { NextResponse } from "next/server";
import { sessionRole } from "@/auth";
import { listMembers, setMemberFounder } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ members: await listMembers() });
}

/** 創設メンバー指定の切り替え。body: { email, founder } */
export async function PATCH(req: Request) {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: { email?: string; founder?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const email = (body.email ?? "").trim();
  if (!email)
    return NextResponse.json({ error: "email required" }, { status: 400 });

  await setMemberFounder(email, !!body.founder);
  return NextResponse.json({ ok: true });
}
