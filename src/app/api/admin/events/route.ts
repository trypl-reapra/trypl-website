import { NextResponse } from "next/server";
import { sessionRole } from "@/auth";
import {
  addEvent,
  deleteEvent,
  listEvents,
  setEventHidden,
} from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function s(v: unknown, max = 300): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function GET() {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ events: await listEvents() });
}

export async function POST(req: Request) {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const title = s(b.title, 160);
  const date = s(b.date, 10);
  if (!title || !date)
    return NextResponse.json({ error: "title and date required" }, { status: 422 });
  const ev = await addEvent(
    {
      title,
      date,
      startTime: s(b.startTime, 10),
      endTime: s(b.endTime, 10),
      place: s(b.place, 200),
      online: !!b.online,
      description: s(b.description, 2000),
      registerUrl: s(b.registerUrl, 500),
      image: s(b.image, 500) || undefined,
    },
    new Date().toISOString(),
  );
  return NextResponse.json({ ok: true, id: ev.id });
}

export async function PATCH(req: Request) {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const id = s(b.id, 60);
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await setEventHidden(id, !!b.hidden);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const id = s(b.id, 60);
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await deleteEvent(id);
  return NextResponse.json({ ok: true });
}
