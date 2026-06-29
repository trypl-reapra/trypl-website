import { NextResponse } from "next/server";
import { sessionRole } from "@/auth";
import { listEvents, listMembers, setAttendance } from "@/lib/store";
import { memberCode } from "@/lib/member";
import { tokenFromScan, emailForToken } from "@/lib/checkin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function s(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * イベント受付（出席記録）。管理者専用。
 * 受け取り方は3通り:
 *  - { eventId, token }    … 会員証QRの読み取り（TRYPL1:...）
 *  - { eventId, memberId } … 会員番号の手入力フォールバック
 *  - { eventId, email, attended } … 一覧からの出席トグル
 * 既定は出席=true（受付）。attended=false で受付取り消し。
 */
export async function POST(req: Request) {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const eventId = s(b.eventId, 60);
  if (!eventId)
    return NextResponse.json({ error: "eventId required" }, { status: 400 });
  const ev = (await listEvents()).find((e) => e.id === eventId);
  if (!ev)
    return NextResponse.json({ ok: false, reason: "event_not_found" });

  const members = await listMembers();
  let email: string | null = null;

  const rawToken = s(b.token, 80);
  const rawMemberId = s(b.memberId, 40);
  const rawEmail = s(b.email, 200);

  if (rawToken) {
    const token = tokenFromScan(rawToken);
    if (!token) return NextResponse.json({ ok: false, reason: "invalid_qr" });
    email = emailForToken(
      token,
      members.map((m) => m.email),
    );
    if (!email) return NextResponse.json({ ok: false, reason: "unknown" });
  } else if (rawMemberId) {
    const target = rawMemberId.toUpperCase();
    const m = members.find((mm) => memberCode(mm.email) === target);
    if (!m) return NextResponse.json({ ok: false, reason: "unknown" });
    email = m.email;
  } else if (rawEmail) {
    email = rawEmail;
  }

  if (!email) return NextResponse.json({ ok: false, reason: "no_target" });

  const member = members.find((m) => m.email === email);
  const name = member?.name || email.split("@")[0];
  const attended = b.attended === false ? false : true;

  const { reg, hadRsvp, wasAttended } = await setAttendance(
    eventId,
    { email, name, memberId: memberCode(email) },
    attended,
    new Date().toISOString(),
  );

  return NextResponse.json({
    ok: true,
    email,
    name,
    memberId: reg.memberId,
    image: member?.image || "",
    founder: !!member?.founder,
    attended: reg.attended,
    alreadyAttended: attended && wasAttended,
    hadRsvp,
    walkIn: !!reg.walkIn,
    registeredAt: reg.registeredAt,
    attendedAt: reg.attendedAt || "",
  });
}
