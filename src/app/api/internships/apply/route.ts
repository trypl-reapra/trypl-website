import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addApplication } from "@/lib/store";
import { getInternship } from "@/data/internships";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 募集への応募。ログイン中の会員のみ。 */
export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: { slug?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const slug = (body.slug ?? "").trim();
  const internship = getInternship(slug);
  if (!internship)
    return NextResponse.json({ error: "not found" }, { status: 404 });

  const app = await addApplication(
    {
      slug,
      company: internship.company,
      title: internship.title,
      name: session?.user?.name ?? "",
      email,
      message: (body.message ?? "").slice(0, 4000),
    },
    new Date().toISOString(),
  );
  return NextResponse.json({ ok: true, id: app.id });
}
