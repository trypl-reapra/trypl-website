import { NextResponse } from "next/server";
import { sessionRole } from "@/auth";
import { listEventRegistrations } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 指定イベントの申込・出席一覧（管理者）。 */
export async function GET(req: Request) {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const eventId = (searchParams.get("eventId") || "").trim();
  if (!eventId)
    return NextResponse.json({ error: "eventId required" }, { status: 400 });
  const registrations = await listEventRegistrations(eventId);
  return NextResponse.json({ registrations });
}
