import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { withdrawMember } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 退会：ログイン中の本人を退会ログに記録し、メンバー一覧から外す。 */
export async function POST() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await withdrawMember(email, new Date().toISOString());
  return NextResponse.json({ ok: true });
}
