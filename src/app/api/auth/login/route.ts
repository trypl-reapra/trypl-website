import { NextResponse } from "next/server";
import { checkPassword, sign, COOKIE, type Role } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    role?: string;
    password?: string;
  };
  const role = body.role as Role;
  if (role !== "admin" && role !== "member")
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  if (typeof body.password !== "string")
    return NextResponse.json({ error: "パスワードを入力してください" }, { status: 400 });
  if (!checkPassword(role, body.password))
    return NextResponse.json({ error: "認証情報が正しくありません" }, { status: 401 });

  const res = NextResponse.json({ ok: true, role });
  res.cookies.set(COOKIE, sign(role), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
