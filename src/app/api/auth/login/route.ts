import { NextResponse } from "next/server";
import { authenticate, sign, COOKIE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
  };
  if (typeof body.password !== "string" || !body.password)
    return NextResponse.json({ error: "パスワードを入力してください" }, { status: 400 });

  const role = authenticate(body.username ?? "", body.password);
  if (!role)
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
