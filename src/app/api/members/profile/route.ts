import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { setMemberProfile, type MemberProfile } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** ログイン中の会員が自分のプロフィール（個人情報）を登録・更新する。 */
export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const profile: MemberProfile = {
    fullName: clean(b.fullName, 80),
    furigana: clean(b.furigana, 80),
    school: clean(b.school, 120),
    department: clean(b.department, 120),
    year: clean(b.year, 40),
    phone: clean(b.phone, 40),
  };
  if (!profile.fullName || !profile.school || !profile.year || !profile.phone)
    return NextResponse.json(
      { error: "missing required fields" },
      { status: 422 },
    );

  await setMemberProfile(email, profile);
  return NextResponse.json({ ok: true });
}
