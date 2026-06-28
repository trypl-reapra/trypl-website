import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addApplication, isMemberFrozen, listMembers } from "@/lib/store";
import { profileComplete } from "@/lib/profile";
import { getInternship } from "@/data/internships";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(v: unknown, max = 4000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** 募集への応募。ログイン中の会員のみ。プロフィールは登録済みのものを使用する。 */
export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (await isMemberFrozen(email))
    return NextResponse.json({ error: "frozen" }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const slug = clean(body.slug, 120);
  const internship = getInternship(slug);
  if (!internship)
    return NextResponse.json({ error: "not found" }, { status: 404 });

  const me = (await listMembers()).find((m) => m.email === email);
  if (!me?.profile || !profileComplete(me.profile))
    return NextResponse.json({ error: "profile required" }, { status: 422 });

  const app = await addApplication(
    {
      slug,
      company: internship.company,
      title: internship.title,
      email,
      profile: me.profile,
      message: clean(body.message, 4000),
    },
    new Date().toISOString(),
  );
  return NextResponse.json({ ok: true, id: app.id });
}
