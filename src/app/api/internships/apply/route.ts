import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addApplication, setMemberProfile, type MemberProfile } from "@/lib/store";
import { getInternship } from "@/data/internships";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** 募集への応募。ログイン中の会員のみ。最低限プロフィールも保存する。 */
export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const slug = clean(body.slug, 120);
  const internship = getInternship(slug);
  if (!internship)
    return NextResponse.json({ error: "not found" }, { status: 404 });

  const profile: MemberProfile = {
    fullName: clean(body.fullName, 80),
    furigana: clean(body.furigana, 80),
    school: clean(body.school, 120),
    department: clean(body.department, 120),
    year: clean(body.year, 40),
    phone: clean(body.phone, 40),
  };

  // 必須項目の検証。
  if (!profile.fullName || !profile.school || !profile.year || !profile.phone)
    return NextResponse.json(
      { error: "missing required fields" },
      { status: 422 },
    );

  // プロフィールを会員に保存（次回以降は自動入力）。
  await setMemberProfile(email, profile);

  const app = await addApplication(
    {
      slug,
      company: internship.company,
      title: internship.title,
      email,
      profile,
      message: clean(body.message, 4000),
    },
    new Date().toISOString(),
  );
  return NextResponse.json({ ok: true, id: app.id });
}
