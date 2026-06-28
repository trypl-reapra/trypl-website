import { NextResponse } from "next/server";
import { sessionRole } from "@/auth";
import { getStats, resetStats } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ stats: await getStats() });
}

/** アクセス数のリセット（テスト用）。 */
export async function DELETE() {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await resetStats();
  return NextResponse.json({ ok: true });
}
