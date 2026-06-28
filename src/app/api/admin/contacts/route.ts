import { NextResponse } from "next/server";
import { sessionRole } from "@/auth";
import { clearContacts, deleteContact, listContacts } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ contacts: await listContacts() });
}

export async function DELETE(req: Request) {
  if ((await sessionRole()) !== "admin")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (b.all) await clearContacts();
  else if (typeof b.id === "string") await deleteContact(b.id);
  else return NextResponse.json({ error: "id or all required" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
