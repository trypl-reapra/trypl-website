import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { removeMemberByEmail } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 退会：ログイン中の本人の会員レコードを削除する。 */
export async function POST() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await removeMemberByEmail(email);
  return NextResponse.json({ ok: true });
}
