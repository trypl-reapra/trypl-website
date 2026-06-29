import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listMemberEventIds, listPublicEvents } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** ログイン会員が申し込んでいるイベントID一覧を返す。未ログインは空。 */
export async function GET() {
  const s = await auth();
  const email = s?.user?.email;
  if (!email || (s!.user as { role?: string }).role === "admin") {
    return NextResponse.json({ eventIds: [] });
  }
  const events = await listPublicEvents();
  const eventIds = await listMemberEventIds(
    email,
    events.map((e) => e.id),
  );
  return NextResponse.json({ eventIds });
}
