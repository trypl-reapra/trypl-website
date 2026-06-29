import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { registerForEvent, unregisterForEvent, listEvents } from "@/lib/store";
import { memberCode } from "@/lib/member";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** ログイン中の一般会員を返す（管理者・未ログインは null）。 */
async function memberFromSession() {
  const s = await auth();
  const email = s?.user?.email;
  if (!email) return null;
  if ((s.user as { role?: string }).role === "admin") return null;
  return { email, name: s.user?.name ?? "" };
}

function eventIdFrom(b: Record<string, unknown>): string {
  return typeof b.eventId === "string" ? b.eventId.trim().slice(0, 60) : "";
}

export async function POST(req: Request) {
  const me = await memberFromSession();
  if (!me) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const eventId = eventIdFrom(b);
  if (!eventId)
    return NextResponse.json({ error: "eventId required" }, { status: 400 });
  const ev = (await listEvents()).find((e) => e.id === eventId && !e.hidden);
  if (!ev)
    return NextResponse.json({ error: "event not found" }, { status: 404 });
  await registerForEvent(
    eventId,
    { email: me.email, name: me.name, memberId: memberCode(me.email) },
    new Date().toISOString(),
  );
  return NextResponse.json({ ok: true, registered: true });
}

export async function DELETE(req: Request) {
  const me = await memberFromSession();
  if (!me) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const eventId = eventIdFrom(b);
  if (!eventId)
    return NextResponse.json({ error: "eventId required" }, { status: 400 });
  await unregisterForEvent(eventId, me.email);
  return NextResponse.json({ ok: true, registered: false });
}
