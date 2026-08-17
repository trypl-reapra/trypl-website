import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isMemberFrozen, setMemberMastery } from "@/lib/store";
import { parseMasteryPayload } from "@/lib/mastery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 熟達タイプ診断の結果を、ログイン中の会員に記録する。
 * body: { r: "<診断サイトのペイロード>" }
 *
 * ペイロードは本人が持ってくる自己申告なので、書式とコード・%の整合だけを
 * 検証して保存する。タイプ名などの表示情報はサーバー側でコードから引き直す。
 */
export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (await isMemberFrozen(email))
    return NextResponse.json({ error: "frozen" }, { status: 403 });

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const rec = parseMasteryPayload(b.r);
  if (!rec)
    return NextResponse.json({ error: "invalid payload" }, { status: 422 });

  await setMemberMastery(email, rec);
  return NextResponse.json({ ok: true, code: rec.code });
}

/** 記録の削除（会員ページの「記録を消す」から）。 */
export async function DELETE() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (await isMemberFrozen(email))
    return NextResponse.json({ error: "frozen" }, { status: 403 });

  await setMemberMastery(email, null);
  return NextResponse.json({ ok: true });
}
