import { NextResponse } from "next/server";
import { addContact } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body) return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const category = String(body.category ?? "一般").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !message)
    return NextResponse.json({ error: "必須項目を入力してください" }, { status: 400 });
  if (!emailRe.test(email))
    return NextResponse.json({ error: "メールアドレスの形式が正しくありません" }, { status: 400 });
  if (message.length > 5000)
    return NextResponse.json({ error: "本文が長すぎます" }, { status: 400 });

  const c = await addContact(
    {
      name: name.slice(0, 100),
      email: email.slice(0, 200),
      category: category.slice(0, 50) || "一般",
      message: message.slice(0, 5000),
    },
    new Date().toISOString(),
  );
  return NextResponse.json({ ok: true, id: c.id });
}
