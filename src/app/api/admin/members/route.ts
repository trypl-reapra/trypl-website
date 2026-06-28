import { NextResponse } from "next/server";
import { sessionRole } from "@/auth";
import {
  adminRemoveMember,
  clearMembers,
  clearWithdrawals,
  deleteWithdrawal,
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

/** 削除（テスト用）。
 *  body: { email } メンバー削除 / { withdrawalId } 退会記録削除 /
 *        { clear: "members" | "withdrawals" } 全消去 */
export async function DELETE(req: Request) {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (b.clear === "members") await clearMembers();
  else if (b.clear === "withdrawals") await clearWithdrawals();
  else if (typeof b.withdrawalId === "string")
    await deleteWithdrawal(b.withdrawalId);
  else if (typeof b.email === "string") await adminRemoveMember(b.email);
  else return NextResponse.json({ error: "target required" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
