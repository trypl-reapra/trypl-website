import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { setMemberProfile } from "@/lib/store";
import {
  profileComplete,
  STATUS_KEYS,
  type MemberProfile,
  type ProfileStatus,
} from "@/lib/profile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** ログイン中の会員が自分のプロフィール（登録情報）を登録・更新する。 */
export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const rawStatus = clean(b.status, 20);
  const status = (
    (STATUS_KEYS as string[]).includes(rawStatus) ? rawStatus : ""
  ) as ProfileStatus;

  const profile: MemberProfile = {
    fullName: clean(b.fullName, 80),
    furigana: clean(b.furigana, 80),
    status,
    affiliation: clean(b.affiliation, 120),
    department: clean(b.department, 120),
    grade: clean(b.grade, 40),
    jobTitle: clean(b.jobTitle, 120),
    note: clean(b.note, 600),
    age: clean(b.age, 10),
    gender: clean(b.gender, 20),
    phone: clean(b.phone, 40),
  };
  if (!profileComplete(profile))
    return NextResponse.json(
      { error: "missing required fields" },
      { status: 422 },
    );

  await setMemberProfile(email, profile);
  return NextResponse.json({ ok: true });
}
