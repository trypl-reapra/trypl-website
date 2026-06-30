import { NextResponse } from "next/server";
import { sessionRole } from "@/auth";
import {
  addInternship,
  clearInternships,
  deleteInternship,
  getOverrides,
  listAdminInternships,
  setOverride,
  updateInternship,
  type Override,
} from "@/lib/store";
import { getAllInternships } from "@/data/internships";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Row = {
  source: "code" | "admin";
  key: string;
  company: string;
  title: string;
  location: string;
  compensation: string;
  summary: string;
  applyUrl: string;
  companyUrl: string;
  hidden: boolean;
};

async function guard() {
  return (await sessionRole()) === "admin";
}

export async function GET() {
  if (!(await guard()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const overrides = await getOverrides();
  const code: Row[] = getAllInternships().map((i) => {
    const ov = overrides[i.slug] ?? {};
    return {
      source: "code",
      key: i.slug,
      company: ov.company ?? i.company,
      title: ov.title ?? i.title,
      location: ov.location ?? i.location,
      compensation: ov.compensation ?? i.compensation,
      summary: ov.summary ?? i.summary,
      applyUrl: ov.applyUrl ?? i.applyUrl,
      companyUrl: ov.companyUrl ?? i.companyUrl ?? "",
      hidden: !!ov.hidden,
    };
  });
  const admin: Row[] = (await listAdminInternships()).map((a) => ({
    source: "admin",
    key: a.id,
    company: a.company,
    title: a.title,
    location: a.location,
    compensation: a.compensation,
    summary: a.summary,
    applyUrl: a.applyUrl,
    companyUrl: a.companyUrl ?? "",
    headerImage: a.headerImage,
    hidden: a.hidden,
  }));

  return NextResponse.json({ admin, code });
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
      applyUrl: String(b.applyUrl ?? "").trim().slice(0, 500),
      companyUrl: String(b.companyUrl ?? "").trim().slice(0, 500) || undefined,
      headerImage: String(b.headerImage ?? "").trim().slice(0, 500) || undefined,
    },
    new Date().toISOString(),
  );
  return NextResponse.json({ ok: true, item });
}

function cleanPatch(b: Record<string, unknown>): Override {
  const p: Override = {};
  if (typeof b.hidden === "boolean") p.hidden = b.hidden;
  for (const f of [
    "company",
    "title",
    "location",
    "compensation",
    "summary",
    "applyUrl",
    "companyUrl",
  ] as const) {
    if (typeof b[f] === "string") p[f] = (b[f] as string).slice(0, 1000);
  }
  return p;
}

export async function PATCH(req: Request) {
  if (!(await guard()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const source = b.source;
  const key = String(b.key ?? "");
  if (!key || (source !== "code" && source !== "admin"))
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  const patch = cleanPatch(b);
  if (source === "code") await setOverride(key, patch);
  else await updateInternship(key, patch);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await guard()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (b.all) {
    await clearInternships();
    return NextResponse.json({ ok: true });
  }
  const source = b.source;
  const key = String(b.key ?? "");
  if (!key) return NextResponse.json({ error: "key が必要です" }, { status: 400 });
  if (source === "admin") await deleteInternship(key);
  else await setOverride(key, { hidden: true });
  return NextResponse.json({ ok: true });
}
