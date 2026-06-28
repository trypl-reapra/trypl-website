import { NextResponse } from "next/server";
import { sessionRole } from "@/auth";
import {
  listMembers,
  listWithdrawals,
  setMemberFounder,
  setMemberFrozen,
} from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const [members, withdrawals] = await Promise.all([
    listMembers(),
    listWithdrawals(),
  ]);
  return NextResponse.json({ members, withdrawals });
}

/** 創設メンバー / 凍結 の切り替え。body: { email, founder? , frozen? } */
export async function PATCH(req: Request) {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: { email?: string; founder?: boolean; frozen?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const email = (body.email ?? "").trim();
  if (!email)
    return NextResponse.json({ error: "email required" }, { status: 400 });

  if (typeof body.founder === "boolean")
    await setMemberFounder(email, body.founder);
  if (typeof body.frozen === "boolean")
    await setMemberFrozen(email, body.frozen);

  return NextResponse.json({ ok: true });
}
