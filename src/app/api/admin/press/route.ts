import { NextResponse } from "next/server";
import { sessionRole } from "@/auth";
import {
  addPress,
  clearPress,
  deletePress,
  listPress,
  setPressHidden,
  updatePress,
} from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function s(v: unknown, max = 300): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function GET() {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ press: await listPress() });
}

export async function POST(req: Request) {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const title = s(b.title, 200);
  const date = s(b.date, 10);
  if (!title || !date)
    return NextResponse.json({ error: "title and date required" }, { status: 422 });
  const p = await addPress(
    {
      title,
      date,
      summary: s(b.summary, 800),
      body: s(b.body, 6000) || undefined,
      image: s(b.image, 500) || undefined,
    },
    new Date().toISOString(),
  );
  return NextResponse.json({ ok: true, id: p.id });
}

export async function PUT(req: Request) {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const id = s(b.id, 60);
  const title = s(b.title, 200);
  const date = s(b.date, 10);
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (!title || !date)
    return NextResponse.json({ error: "title and date required" }, { status: 422 });
  await updatePress(id, {
    title,
    date,
    summary: s(b.summary, 800),
    body: s(b.body, 6000) || undefined,
    image: s(b.image, 500) || undefined,
  });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const id = s(b.id, 60);
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await setPressHidden(id, !!b.hidden);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (b.all) {
    await clearPress();
    return NextResponse.json({ ok: true });
  }
  const id = s(b.id, 60);
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await deletePress(id);
  return NextResponse.json({ ok: true });
}
