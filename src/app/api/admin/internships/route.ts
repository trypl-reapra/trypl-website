import { NextResponse } from "next/server";
import { currentRole } from "@/lib/auth";
import {
  addInternship,
  deleteInternship,
  listAdminInternships,
  setInternshipHidden,
} from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function guard() {
  return (await currentRole()) === "admin";
}

export async function GET() {
  if (!(await guard()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ internships: await listAdminInternships() });
}

export async function POST(req: Request) {
  if (!(await guard()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const company = String(b.company ?? "").trim();
  const title = String(b.title ?? "").trim();
  if (!company || !title)
    return NextResponse.json({ error: "企業名とタイトルは必須です" }, { status: 400 });
  const item = await addInternship(
    {
      company: company.slice(0, 120),
      title: title.slice(0, 160),
      location: String(b.location ?? "").trim().slice(0, 120),
      compensation: String(b.compensation ?? "").trim().slice(0, 120),
      summary: String(b.summary ?? "").trim().slice(0, 1000),
      applyUrl: String(b.applyUrl ?? "").trim().slice(0, 500) || "#",
    },
    new Date().toISOString(),
  );
  return NextResponse.json({ ok: true, item });
}

export async function PATCH(req: Request) {
  if (!(await guard()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as {
    id?: string;
    hidden?: boolean;
  };
  if (!b.id) return NextResponse.json({ error: "id が必要です" }, { status: 400 });
  await setInternshipHidden(b.id, !!b.hidden);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await guard()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as { id?: string };
  if (!b.id) return NextResponse.json({ error: "id が必要です" }, { status: 400 });
  await deleteInternship(b.id);
  return NextResponse.json({ ok: true });
}
