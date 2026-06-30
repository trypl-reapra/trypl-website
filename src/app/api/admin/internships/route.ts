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
import { asCategoryKey, getAllInternships } from "@/data/internships";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const asCategory = (v: unknown): string => asCategoryKey(String(v ?? "").trim());
const WORK_STYLES = ["remote", "hybrid", "onsite"];
const asWorkStyle = (v: unknown, fallback = "remote"): string => {
  const s = String(v ?? "").trim();
  return WORK_STYLES.includes(s) ? s : fallback;
};
const str = (v: unknown, max: number): string => String(v ?? "").trim().slice(0, max);
const list = (v: unknown): string[] =>
  Array.isArray(v)
    ? v
        .map((x) => String(x).trim())
        .filter(Boolean)
        .slice(0, 40)
        .map((s) => s.slice(0, 400))
    : [];

type Row = {
  source: "code" | "admin";
  key: string;
  company: string;
  companyTag: string;
  title: string;
  location: string;
  workStyle: string;
  commitment: string;
  duration: string;
  compensation: string;
  summary: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  welcome: string[];
  tags: string[];
  applyUrl: string;
  companyUrl: string;
  category: string;
  headerImage: string;
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
      companyTag: ov.companyTag ?? i.companyTag,
      title: ov.title ?? i.title,
      location: ov.location ?? i.location,
      workStyle: ov.workStyle ?? i.workStyle,
      commitment: ov.commitment ?? i.commitment,
      duration: ov.duration ?? i.duration,
      compensation: ov.compensation ?? i.compensation,
      summary: ov.summary ?? i.summary,
      about: ov.about ?? i.about,
      responsibilities: ov.responsibilities ?? i.responsibilities,
      requirements: ov.requirements ?? i.requirements,
      welcome: ov.welcome ?? i.welcome,
      tags: ov.tags ?? i.tags,
      applyUrl: ov.applyUrl ?? i.applyUrl,
      companyUrl: ov.companyUrl ?? i.companyUrl ?? "",
      category: ov.category ?? i.category,
      headerImage: ov.headerImage ?? i.headerImage ?? "",
      hidden: !!ov.hidden,
    };
  });
  const admin: Row[] = (await listAdminInternships()).map((a) => ({
    source: "admin",
    key: a.id,
    company: a.company,
    companyTag: a.companyTag ?? "",
    title: a.title,
    location: a.location,
    workStyle: asWorkStyle(a.workStyle),
    commitment: a.commitment ?? "",
    duration: a.duration ?? "",
    compensation: a.compensation,
    summary: a.summary,
    about: a.about ?? "",
    responsibilities: a.responsibilities ?? [],
    requirements: a.requirements ?? [],
    welcome: a.welcome ?? [],
    tags: a.tags ?? [],
    applyUrl: a.applyUrl,
    companyUrl: a.companyUrl ?? "",
    category: asCategory(a.category),
    headerImage: a.headerImage ?? "",
    hidden: a.hidden,
  }));

  return NextResponse.json({ admin, code });
}

export async function POST(req: Request) {
  if (!(await guard()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const company = str(b.company, 120);
  const title = str(b.title, 160);
  if (!company || !title)
    return NextResponse.json({ error: "企業名とタイトルは必須です" }, { status: 400 });
  const item = await addInternship(
    {
      company,
      companyTag: str(b.companyTag, 120) || undefined,
      title,
      location: str(b.location, 120),
      workStyle: asWorkStyle(b.workStyle),
      commitment: str(b.commitment, 120) || undefined,
      duration: str(b.duration, 120) || undefined,
      compensation: str(b.compensation, 120),
      summary: str(b.summary, 1000),
      about: str(b.about, 4000) || undefined,
      responsibilities: list(b.responsibilities),
      requirements: list(b.requirements),
      welcome: list(b.welcome),
      tags: list(b.tags),
      category: asCategory(b.category),
      applyUrl: str(b.applyUrl, 500),
      companyUrl: str(b.companyUrl, 500) || undefined,
      headerImage: str(b.headerImage, 500) || undefined,
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
    "companyTag",
    "title",
    "location",
    "commitment",
    "duration",
    "compensation",
    "summary",
    "about",
    "applyUrl",
    "companyUrl",
    "headerImage",
  ] as const) {
    if (typeof b[f] === "string") p[f] = (b[f] as string).slice(0, 4000);
  }
  if (typeof b.category === "string") p.category = asCategory(b.category);
  if (typeof b.workStyle === "string") p.workStyle = asWorkStyle(b.workStyle);
  for (const f of ["responsibilities", "requirements", "welcome", "tags"] as const) {
    if (Array.isArray(b[f])) p[f] = list(b[f]);
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
